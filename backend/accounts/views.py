from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth.hashers import make_password
from .models import CustomUser , CoachProfile , PlayerProfile
from rest_framework.permissions import IsAuthenticated
class AdminSignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data

        if data.get("role") != "admin":
            return Response({"error": "Only admin signup is allowed"}, status=403)

        try:
            user = CustomUser.objects.create(
                username=data["username"],  # souvent = email
                email=data["email"],
                password=make_password(data["password"]),
                role="admin",
                first_name=data.get("first_name", ""),
                last_name=data.get("last_name", "")
            )

            # 👇 Ajout du téléphone et club si ton modèle CustomUser les contient
            user.phone = data.get("phone", "")
            user.club = data.get("club", "")
            user.save()

            token = Token.objects.create(user=user)
            return Response({"token": token.key}, status=201)

        except Exception as e:
            return Response({"error": str(e)}, status=400)
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from accounts.models import CustomUser  # adapte selon ton app

class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"error": "Email et mot de passe requis"}, status=400)

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response({"error": "Identifiants invalides"}, status=401)

        if user.check_password(password):
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                "token": token.key,
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "role": user.role,  # 'admin', 'coach' ou 'player'
                    "username": user.username
                }
            }, status=200)
        else:
            return Response({"error": "Identifiants invalides"}, status=401)


class CoachSignupView(APIView):
   
    permission_classes = [IsAuthenticated]  # seul un admin peut créer un coach

    def post(self, request):
        if request.user.role != "admin":
            return Response({"error": "Only admins can create coaches"}, status=403)

        data = request.data
        required_fields = ['username', 'email', 'password']

        if not all(field in data for field in required_fields):
            return Response({"error": "Missing required fields"}, status=400)

        try:
            user = CustomUser.objects.create(
                username=data["username"],
                email=data["email"],
                password=make_password(data["password"]),
                role="coach",
                first_name=data.get("first_name", ""),
                last_name=data.get("last_name", ""),
                phone=data.get("phone", ""),
                club=data.get("club", "")
            )

            CoachProfile.objects.create(
                user=user,
                specialization=data.get("specialization", ""),
                years_of_experience=data.get("years_of_experience", 0),
                certification=data.get("certification", ""),
                notes=data.get("notes", "")
            )

            return Response({"message": "Coach account created successfully"}, status=201)

        except Exception as e:
            return Response({"error": str(e)}, status=400)
        
from rest_framework import viewsets , permissions
from .models import CoachProfile
from .serializers import CoachSerializer , PlayerProfileSerializer
from django.db import IntegrityError

class CoachViewSet(viewsets.ModelViewSet):
    queryset = CoachProfile.objects.all()
    serializer_class = CoachSerializer
    permission_classes = [permissions.IsAuthenticated]
    
class PlayerSignupView(APIView):
    permission_classes = [IsAuthenticated] # Permet l'accès sans authentification

    def post(self, request):
        data = request.data
        required_fields = ['username', 'email', 'password', 'full_name']
        
        # Vérification des champs requis
        if not all(field in data for field in required_fields):
            return Response(
                {"error": f"Missing required fields: {', '.join(required_fields)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Création de l'utilisateur
            user = CustomUser.objects.create(
                username=data["username"],
                email=data["email"],
                password=make_password(data["password"]),
                role="player",  # Définit automatiquement le rôle comme 'player'
                first_name=data.get("first_name", ""),
                last_name=data.get("last_name", ""),
                phone=data.get("phone", "")
            )

            # Création du profil joueur
            player = PlayerProfile.objects.create(
                user=user,
                full_name=data["full_name"],
                
                height=data.get("height", 0),
                weight=data.get("weight", 0),
                position=data.get("position", "Midfielder"),
                status=data.get("status", "Active"),
                group=data.get("group", ""),
                subgroup=data.get("subgroup", ""),
                phone=data.get("phone", ""),
                address=data.get("address", ""),
                notes=data.get("notes", "")
            )

            # Retourne les données du joueur créé
            serializer = PlayerProfileSerializer(player)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except IntegrityError:
            return Response(
                {"error": "Username or email already exists"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )   
    

class PlayerViewSet(viewsets.ModelViewSet):
    queryset = PlayerProfile.objects.all()
    serializer_class = PlayerProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtrage par groupe si paramètre fourni
        group = self.request.query_params.get('group', None)
        if group:
            queryset = queryset.filter(group=group)
            
        return queryset