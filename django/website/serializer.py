from rest_framework import serializers

from .models import ContactForm

class ContactFormSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactForm
        fields = ['name', 'subject', 'message', 'created_at', 'status', 'id']