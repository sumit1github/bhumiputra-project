from django.contrib.auth.models import BaseUserManager


class MyAccountManager(BaseUserManager):
    def create_user(self, email, password, contact1):
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(
            email=self.normalize_email(email),
            contact1=contact1
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, contact1):
        user = self.create_user(
            email=self.normalize_email(email),
            password=password,
            contact1=contact1
            
        )

        user.is_staff = True
        user.is_active = True
        user.is_superuser = True
        user.save(using=self._db)
        return user