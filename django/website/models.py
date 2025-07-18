from django.db import models

class ContactForm(models.Model):
    STATUS_CHOICES = [
        ('new', 'New'),
        ('resolved', 'Resolved'),
    ]
    
    name = models.CharField(max_length=255, blank=False, null=False)
    subject = models.CharField(max_length=255, blank=False, null=False)
    message = models.TextField(blank=False, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')

    def __str__(self):
        return f"{self.name} - {self.subject}"
    
    class Meta:
        verbose_name = "Contact"
        verbose_name_plural = "Contacts"
        db_table = "contact_form"
        ordering = ['-created_at']
