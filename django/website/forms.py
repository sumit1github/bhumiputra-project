from django import forms

from website.models import ContactForm

class ContactFormForm(forms.ModelForm):
    class Meta:
        model = ContactForm
        fields = ['name', 'subject', 'message']
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-control', 
                'placeholder': 'Your Name',
                'required': True
            }),
            'subject': forms.TextInput(attrs={
                'class': 'form-control', 
                'placeholder': 'Subject',
                'required': True
            }),
            'message': forms.Textarea(attrs={
                'class': 'form-control', 
                'rows': 5, 
                'placeholder': 'Your Message',
                'required': True
            }),
        }
    
    def clean_name(self):
        name = self.cleaned_data.get('name')
        if not name or len(name.strip()) < 2:
            raise forms.ValidationError("Name must be at least 2 characters long.")
        return name.strip()
    
    def clean_subject(self):
        subject = self.cleaned_data.get('subject')
        if not subject or len(subject.strip()) < 3:
            raise forms.ValidationError("Subject must be at least 3 characters long.")
        return subject.strip()
    
    def clean_message(self):
        message = self.cleaned_data.get('message')
        if not message or len(message.strip()) < 10:
            raise forms.ValidationError("Message must be at least 10 characters long.")
        return message.strip()