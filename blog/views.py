from datetime import date

from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from rest_framework import permissions
from django.views.generic import TemplateView

from blog.models import Banner
from schedule.models import Schedule
from notice.models import Notice

from blog.serializers import BannerSerializer, ScheduleMainSerializer, NoticeMainSerializer


class HomeView(TemplateView):
    template_name = "index.html"

class AboutPageView(TemplateView):
    template_name = "about.html"

class BannerListAPIView(ListAPIView):
    queryset = Banner.objects.all()
    serializer_class = BannerSerializer
    
    def get_serializer_context(self):
        """
        Extra context provided to the serializer class.
        """
        return {
            'request': None, # 이미지 필드 Full URL이 아닌 상대 경로로 반환하기 위해 None 설정
            'format': self.format_kwarg,
            'view': self
        }

class MainSummaryView(APIView):
    """
    메인 페이지용 API
    - GET /api/main/
      - today_schedules: 오늘 기준 일정 2개
      - latest_notice: 가장 최근 공지 1개
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        today = date.today()

        # ✅ today 기준 포함/이후 일정 2개
        today_qs = Schedule.objects.filter(
            Q(end_date__isnull=True, start_date__gte=today) |
            Q(end_date__isnull=False, end_date__gte=today)
        ).order_by("start_date", "title")[:2]

        today_schedules = ScheduleMainSerializer(today_qs, many=True).data

        # ✅ 가장 최근 공지 1개
        latest_notice_obj = Notice.objects.order_by("-created_at").first()
        latest_notice = (
            NoticeMainSerializer(latest_notice_obj).data
            if latest_notice_obj
            else None
        )

        data = {
            "today_schedules": today_schedules,
            "latest_notice": latest_notice,
        }
        return Response(data)
