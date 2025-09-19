from rest_framework.permissions import BasePermission, SAFE_METHODS
from django.db.models import Model
from users.models import CustomUser

class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj: Model):
        if request.method in SAFE_METHODS:
            return True
        
        owner_field_names = ['user', 'customer']
        for field_name in owner_field_names:
            if hasattr(obj, field_name):
                return getattr(obj, field_name) == request.user
            

        return False

class IsManager(BasePermission):
    def has_permission(self, request, view):

        user = getattr(request, "user", None)
        if not user or not user.is_authenticated:
            return False
        return (
            getattr(user, "role", None) == CustomUser.Role.MANAGER
            or getattr(user, "is_staff", False)
        )