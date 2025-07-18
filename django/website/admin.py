from django.contrib import admin

from .models import ContactForm
@admin.register(ContactForm)
class ContactFormAdmin(admin.ModelAdmin):
    list_display = ('name', 'subject', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('name', 'subject', 'message')
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)

    def has_add_permission(self, request):
        return False
