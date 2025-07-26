from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin


from .manager import MyAccountManager
from .constants import GENDER_CHOICES
from utils import GetDateTime, generate_unique_id

class User(AbstractBaseUser, PermissionsMixin):
    full_name = models.CharField(max_length=255, null= True, blank= True)
    password = models.TextField(null=True,blank=True)
    id_prefix = models.CharField(max_length=10, null=True,blank=True)
    email = models.EmailField(null=True,blank=True,unique=True)
    contact1 = models.CharField(max_length=255, null= True, blank= True, unique= True)
    contact2 = models.CharField(max_length=255, null= True, blank= True)
    role = models.TextField(default="USER") # comma separated values
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
    achiver_level = models.PositiveBigIntegerField(null=True, blank=True, default=0)

    # wallet
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children' )
    wallet_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, null=True, blank=True)
    invite_tokens = models.PositiveIntegerField(default=0, null=True, blank=True) # if invite tokens = 5, user can invite 5 users only

    invitation_chain_meta_list = models.JSONField(null=True, blank = True)

    got_joining_package = models.BooleanField(default=False)

    USERNAME_FIELD = "email"	
    REQUIRED_FIELDS = ["password","contact1"]
    

    objects = MyAccountManager()

    def get_user_invite_hierarchy_dict(self):
        user=self.parent
        H_dict = {}
        while user != None:

            if not user.is_superuser:
                H_dict["user"] = user.id
            else:
                H_dict['admin'] = user.id

            user = user.parent
        
        return H_dict

    def save(self, *args, **kwargs):
        td = GetDateTime()
        if self.dob:
            self.age  = td.age_from_dob(self.dob)
        
        if not self.id_prefix:
            # Generate a unique ID prefix if not provided
            self.id_prefix = f"BP{str(generate_unique_id(5))}"
        
        if not self.invitation_chain_meta_list:
            self.invitation_chain_meta_list = self.get_user_invite_hierarchy_dict()
        
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
    def is_distributer(self):
        """
        Check if the user has the 'DISTRIBUTER' role.
        
        Returns:
            bool: True if the user has the 'DISTRIBUTER' role, False otherwise.
        """
        return self.has_access("DISTRIBUTER")
    
    @property
    def is_it(self):
        """
        Check if the user has the 'IT' role.
        
        Returns:
            bool: True if the user has the 'IT' role, False otherwise.
        """
        return self.has_access("IT")
    
    @property
    def is_admin(self):
        """
        Check if the user has the 'ADMIN' role.
        
        Returns:
            bool: True if the user has the 'DISTRIBUTER' role, False otherwise.
        """
        return self.has_access("ADMIN") or self.is_superuser
    
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
        Determines if the user has access based on their role and the required permissions, supporting negative conditions (e.g., '!DISTRIBUTER').

        Args:
            permissions (str): A string of required permissions. 
                - Comma-separated (e.g., "read,write,!delete") to check if the user has any one of the permissions (including negative checks).
                - Space-separated (e.g., "read write !delete") to check if the user has all the permissions (including negative checks).

        Returns:
            bool: True if the user has the required permissions, False otherwise.
        """
        if not permissions or not self.role:
            return False

        user_roles = [role.strip().lower() for role in self.role.split(',') if role.strip()]
        perms = [perm.strip() for perm in (permissions.split(',') if ',' in permissions else permissions.split(' ')) if perm.strip()]

        def check_perm(perm):
            if perm.startswith('!'):
                return perm[1:].lower() not in user_roles
            else:
                return perm.lower() in user_roles

        if ',' in permissions:
            # ANY ONE permission is enough (positive or negative)
            return any(check_perm(perm) for perm in perms)
        else:
            # ALL permissions must be there (positive and negative)
            return all(check_perm(perm) for perm in perms)

