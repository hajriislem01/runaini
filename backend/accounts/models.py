from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('coach', 'Coach'),
        ('player', 'Player'),
    )

    # Champs obligatoires étendus
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='admin')
    phone = models.CharField(max_length=20, blank=True, null=True)
    club = models.CharField(max_length=100, blank=True, null=True)

    # Rendre l'email unique
    email = models.EmailField(unique=True)

    def __str__(self):
        return f"{self.username} ({self.role})"



class CoachProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='coach_profile')
    specialization = models.CharField(max_length=255, blank=True, null=True)
    years_of_experience = models.PositiveIntegerField(blank=True, null=True)
    certification = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=20, choices=[('Active', 'Active'), ('Inactive', 'Inactive'), ('On Leave', 'On Leave')], default='Active')
    address = models.CharField(max_length=255, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Coach Profile: {self.user.username}"


class PlayerProfile(models.Model):
    POSITION_CHOICES = [
        ('Midfielder', 'Milieu'),
        ('Defender', 'Défenseur'), 
        ('Forward', 'Attaquant'),
        ('Goalkeeper', 'Gardien'),
    ]
    
    STATUS_CHOICES = [
        ('Active', 'Actif'),
        ('Inactive', 'Inactif'),
        ('Injured', 'Blessé')
    ]

    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='player_profile')
    full_name = models.CharField(max_length=100)
    
    height = models.FloatField()
    weight = models.FloatField()
    position = models.CharField(max_length=20, choices=POSITION_CHOICES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Active')
    
    # Nouveaux champs
    group = models.CharField(max_length=100, blank=True, null=True)
    subgroup = models.CharField(max_length=100, blank=True, null=True)
    
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.full_name


class Group(models.Model):
    name = models.CharField(max_length=100)
    coach = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'coach'},
        related_name='coaching_groups'  
    )
    players = models.ManyToManyField(PlayerProfile, related_name='player_groups', blank=True)

    def __str__(self):
        return self.name

