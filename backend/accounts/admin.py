from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, CoachProfile, PlayerProfile

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['username', 'email', 'role', 'is_staff', 'is_active']
    fieldsets = UserAdmin.fieldsets + (
    ('Rôle et infos supplémentaires', {'fields': ('role', 'phone', 'club')}),
)

from .models import Group

@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ['name', 'coach']
    filter_horizontal = ['players']

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(CoachProfile)
admin.site.register(PlayerProfile)
