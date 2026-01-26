# api_urls.py
from rest_framework.routers import DefaultRouter
from .views import CoachViewSet , PlayerViewSet
from django.urls import path , include
from .views import AdminSignupView , LoginView , CoachSignupView , PlayerSignupView
router = DefaultRouter()
router.register(r'coaches', CoachViewSet, basename='CoachProfile')
router.register(r'players', PlayerViewSet, basename='PlayerProfile')
urlpatterns = [
    
    path('signup/', AdminSignupView.as_view(), name='admin-signup'),
    
    path('signup/coach/', CoachSignupView.as_view(), name='coach_signup'),
    
    path('players/signup/', PlayerSignupView.as_view(), name='player-signup'),
    path('login/', LoginView.as_view(), name='login'),
    
]
urlpatterns += router.urls
