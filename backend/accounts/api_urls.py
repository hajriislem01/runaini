# api_urls.py
from rest_framework.routers import DefaultRouter
from .views import CoachViewSet

router = DefaultRouter()
router.register(r'coaches', CoachViewSet, basename='CoachProfile')

urlpatterns = router.urls
