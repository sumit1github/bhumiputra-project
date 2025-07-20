from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from django.views import View
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.utils import timezone
import json

from ..forms import ContactFormForm
from ..models import ContactForm
from utils import paginate
from auth_module.custom_decorator import access_limited_to
from ..serializer import ContactFormSerializer

app_name = 'website/'


# @method_decorator(cache_page(60 * 60 * 24), name='get')  # Cache for 24 hours
class IndexView(View):
    template = app_name + 'landing.html'
    form_class = ContactFormForm

    def get(self, request):
        context = {
            'contact_form': self.form_class(),
        }
        return render(request, self.template, context)
    
# @method_decorator(cache_page(60 * 60 * 24), name='get')  # Cache for 24 hours    
class GalleryView(View):
    template = app_name + 'gallery.html'

    def get(self, request):
        return render(request, self.template)
    
class ContactPOSTView(View):
    @method_decorator(csrf_exempt, name='dispatch')
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)
    
    def post(self, request):
        if request.headers.get('Content-Type') == 'application/json':
            
            data = json.loads(request.body)
            form = ContactFormForm(data)
        else:
            form = ContactFormForm(request.POST)
        
        if form and form.is_valid():
            form.save()
            return JsonResponse({
                'success': True,
                'message': '✅ Thank you! Your message has been sent successfully. We will get back to you soon.'
            })
        else:
            return JsonResponse({
                'success': False,
                'message': '❌ There was an error sending your message. Please check the form and try again.',
                'errors': form.errors
            })

@method_decorator(access_limited_to('ADMIN,IT'), name='dispatch')
class ContactList(APIView):
    
    def get(self, request):

        filter = request.GET.get('filter', "new")
        filter = filter.lower()

        QUERY_FILTER = {}

        if filter in ["new", "resolved"]:
            QUERY_FILTER['status'] = filter
        
        if filter == "today":
            today = timezone.now().date()
            QUERY_FILTER['created_at__date'] = today
        
        if filter == "yesterday":
            yesterday = timezone.now().date() - timezone.timedelta(days=1)
            QUERY_FILTER['created_at__date'] = yesterday

        if QUERY_FILTER == {}:
            contact_list = ContactForm.objects.all().order_by('-created_at')
        else:
            contact_list = ContactForm.objects.filter(**QUERY_FILTER).order_by('-created_at')

        print(contact_list)
        page, paginator_meta_data = paginate(
            request,
            contact_list,
            50
        )
        serialized_data = ContactFormSerializer(page, many=True).data
        return Response({

            "status": 200,
            "contact_list": serialized_data,
            "pagination_meta_data": paginator_meta_data
        })
    
    def patch(self, request):
        
        contact_id = request.GET.get('cid')

        contact = ContactForm.objects.get(id=contact_id)
        contact.status = "resolved"
        contact.save()
        return Response({
            "status": 200,
            "message": "Contact form submission marked as resolved.",
            "contact_id": contact_id
        })