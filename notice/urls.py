from rest_framework.routers import DefaultRouter
from notice.views import NoticeDetailPageView, NoticeListPageView, NoticeViewSet

from django.urls import path, include

router = DefaultRouter()
router.register(r'notices', NoticeViewSet, basename='notice')


urlpatterns = [
    path("notices/", NoticeListPageView.as_view(), name="notice-list-page"),
    path("notices/<int:pk>/", NoticeDetailPageView.as_view(), name="notice-detail-page"),
    path("api/", include(router.urls)),
]