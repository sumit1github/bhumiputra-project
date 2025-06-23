from django.db import models


from django.contrib.auth.models import User
from common import GENDER_CHOICES

class DoctorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='doctor_profile')
    
    # Basic Information
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    
    # Contact Information
    address = models.TextField(blank=True, null=True)
    
    # Professional Information
    specialty = models.CharField(max_length=100)
    qualifications = models.TextField(blank=True, null=True)
    registration_number = models.CharField(max_length=100, blank=True, null=True)
    years_of_experience = models.PositiveIntegerField(default=0)
    
    # Availability
    is_available = models.BooleanField(default=True)  # To check if doctor is available for appointments
    available_days = models.CharField(max_length=100, blank=True, null=True)  # Days when doctor is available
    available_hours = models.CharField(max_length=100, blank=True, null=True)  # Timings for availability
    
    # Profile Picture
    profile_picture = models.ImageField(upload_to='doctor_profiles/', blank=True, null=True)

    # Created and Updated timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Dr. {self.first_name} {self.last_name}"

    class Meta:
        verbose_name = "Doctor Profile"
        verbose_name_plural = "Doctor Profiles"
