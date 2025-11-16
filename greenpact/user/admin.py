from django.contrib import admin
from . import models
from django.contrib.auth.admin import UserAdmin

admin.site.register(models.ContractorProfile)
admin.site.register(models.FarmerProfile)
admin.site.register(models.Documents)

@admin.register(models.CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ("username", "email", "type", "is_staff", "is_active")
    search_fields = ("username", "email") 
    list_filter = ("type", "is_staff", "is_superuser", "is_active") 
    ordering = ("id",)

    fieldsets = (
        ("User Info", {"fields": ("username", "email", "password")}),
        ("Personal Info", {"fields": ("first_name", "last_name", "type")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Important Dates", {"fields": ("last_login", "date_joined")}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("username", "email", "password1", "password2", "type", "is_staff", "is_superuser"),
        }),
    )

