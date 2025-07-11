from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin


from .manager import MyAccountManager
from .constants import GENDER_CHOICES
from utils import GetDateTime

class User(AbstractBaseUser, PermissionsMixin):
    full_name = models.CharField(max_length=255, null= True, blank= True)
    password = models.TextField(null=True,blank=True)
    
    email = models.EmailField(null=True,blank=True,unique=True)
    contact1 = models.CharField(max_length=255, null= True, blank= True, unique= True)
    contact2 = models.CharField(max_length=255, null= True, blank= True)
    role = models.TextField() # comma separated values
    token= models.TextField(null=True, blank=True)

    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)

    date_joined = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # details
    age = models.IntegerField(null=True, blank=True)
    dob = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    zip_code = models.CharField(max_length=20, null=True, blank=True)

    # meta data
    joining_level = models.PositiveBigIntegerField(null=True, blank=True)
    achiver_level = models.PositiveBigIntegerField(null=True, blank=True)

    # wallet
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children' )
    wallet_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, null=True, blank=True)

    USERNAME_FIELD = "email"	
    REQUIRED_FIELDS = ["password","contact1"]
    

    objects = MyAccountManager()
    
    def save(self, *args, **kwargs):
        td = GetDateTime()
        if self.dob:
            self.age  = td.age_from_dob(self.dob)
        
        super(User, self).save(*args, **kwargs)
    
    @property
    def full_contact_number(self):
        if self.contact1:
            contact_number = '+91' + self.contact1
        else:
            contact_number='no contact present'

        return contact_number

    def __str__(self):
        return self.email
    
    @property
    def get_roles_list(self):
        try:
            if not self.role:
                return []

            # Ensure it's a string before splitting
            if isinstance(self.role, str):
                return [role.strip() for role in self.role.split(',') if role.strip()]
            else:
                return []
        except Exception as e:
            # Optional: Log error if needed
            return []

    def has_access(self, permissions):
        """
        Determines if the user has access based on their role and the required permissions.

        This method checks whether the user's role contains the required permissions. 
        Permissions can be provided as a comma-separated string (for any one permission) 
        or a space-separated string (for all permissions).

        Args:
            permissions (str): A string of required permissions. 
            - Comma-separated (e.g., "read,write") to check if the user has any one of the permissions.
            - Space-separated (e.g., "read write") to check if the user has all the permissions.

        Returns:
            bool: True if the user has the required permissions, False otherwise.

        Examples:
            user.role = "admin read write"
            user.has_access("read,write")  # Returns True (any one permission is enough)
            user.has_access("read write")  # Returns True (all permissions are required)
            user.has_access("delete")     # Returns False (permission not found in role)
        """
        if not permissions or not self.role:
            return False

        # Always normalize both sides
        user_role = self.role.lower()

        if ',' in permissions:
            # ANY ONE permission is enough
            perms = [perm.strip().lower() for perm in permissions.split(',')]
            return any(perm in user_role for perm in perms)
        else:
            # ALL permissions must be there
            perms = [perm.strip().lower() for perm in permissions.split(' ')]
            return all(perm in user_role for perm in perms)



