from django.urls import path, include
from rest_framework.routers import DefaultRouter
from place.views import PlaceViewSet, PlaceListPageView, PlaceDetailPageView


router = DefaultRouter()
router.register('places', PlaceViewSet, basename='place')

urlpatterns = [
    path("places/", PlaceListPageView.as_view(), name="place-list-page"),
    path("places/<int:pk>/", PlaceDetailPageView.as_view(), name="place-detail-page"),
    path('api/', include(router.urls)),
]