

from rest_framework import serializers
from .models import CustomUser, CoachProfile, PlayerProfile

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'role']

class CoachSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password', 'role', 'phone', 'club']
        extra_kwargs = {'role': {'default': 'coach'}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = CustomUser(**validated_data)
        user.set_password(password)  # Hash password
        user.role = 'coach'
        user.save()
        return user

# serializers.py
class PlayerProfileSerializer(serializers.ModelSerializer):
    
    
    class Meta:
        model = PlayerProfile
        fields = '__all__'
        extra_kwargs = {
            'user': {'read_only': True}
        }

   