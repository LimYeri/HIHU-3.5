from django.urls import path, include
from rest_framework.routers import DefaultRouter
from schedule.views import ScheduleViewSet, SchedulePageView

router = DefaultRouter()
router.register(r"schedules", ScheduleViewSet, basename="schedule")

urlpatterns = [
    path("schedules/", SchedulePageView.as_view(), name="schedule-page"),
    path('api/', include(router.urls)),
]