from django.urls import path , include
from .views import AdminSignupView , LoginView , CoachSignupView , PlayerSignupView


urlpatterns = [
    path('signup/', AdminSignupView.as_view(), name='admin-signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('signup/coach/', CoachSignupView.as_view(), name='coach_signup'),
    
    path('players/signup/', PlayerSignupView.as_view(), name='player-signup'),
    path('', include('accounts.api_urls')), 
]
