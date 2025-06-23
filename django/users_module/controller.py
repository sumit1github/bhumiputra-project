from django.core.exceptions import FieldError

from auth_module.models import User

class UserController:
    def __init__(self, user = None):
        self.obj = user
    
    def user_list_filter(self, filter={}):
        try:
            users = User.objects.filter(**filter)
            return {"error": False, "user_list": users, "message":""}
            
        except FieldError as e:
            return {"error": True, "message": f"Invalid filter field: {e}"}
        except Exception as e:
            return {"error": True, "message": f"Unexpected error: {str(e)}"}

    def add_new_user(self, data):
        try:
            user = User.objects.create(**data)
            return {"error": False, "user": user, "message":f"{user.full_name} : is added successfully."}
        except Exception as e:
            return {"error": True, "message": f"Unexpected error: {str(e)}"}

    def inactive_user(self, pk):
        try:
            user = User.objects.get(pk=pk)
            user.is_active = False
            user.save()
            return {"error": False, "message": f"user is deactivated successfully."}
        except User.DoesNotExist:
            return {"error": True, "message": "User does not exist."}
        except Exception as e:
            return {"error": True, "message": f"Unexpected error: {str(e)}"}