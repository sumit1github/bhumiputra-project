from django.db import models

from auth_module.models import User
from users_module.constants import BLOOD_GROUP_CHOICES

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    joined_date = models.DateTimeField(auto_now_add=True)

    contact1 = models.CharField(max_length=15, blank=True, null=True)
    contact2 = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    zip_code = models.CharField(max_length=10, blank=True, null=True)
    aadharr_number = models.CharField(max_length=12, blank=True, null=True)
    pan_number = models.CharField(max_length=10, blank=True, null=True)
    blood_group = models.CharField(max_length=3, choices=BLOOD_GROUP_CHOICES, blank=True, null=True)

    salary = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    is_verified = models.BooleanField(default=False) # by It team
    is_approved = models.BooleanField(default=False) # by Admin team

    class Meta:
        db_table = 'user_profile'
