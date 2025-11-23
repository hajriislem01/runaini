# api_urls.py
from rest_framework.routers import DefaultRouter
from .views import CoachViewSet , PlayerViewSet

router = DefaultRouter()
router.register(r'coaches', CoachViewSet, basename='CoachProfile')
router.register(r'players', PlayerViewSet, basename='PlayerProfile')
urlpatterns = router.urls
