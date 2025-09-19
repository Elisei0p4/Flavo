from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'role', 'flavo_coins')
    list_filter = UserAdmin.list_filter + ('role',)
    fieldsets = UserAdmin.fieldsets + (
        ('Flavo Coins', {'fields': ('flavo_coins',)}),
        ('Role Management', {'fields': ('role',)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Flavo Coins', {'fields': ('flavo_coins',)}),
        ('Role Management', {'fields': ('role',)}),
    )

admin.site.register(CustomUser, CustomUserAdmin)