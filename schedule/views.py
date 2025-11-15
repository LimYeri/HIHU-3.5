from datetime import date
import calendar

from django.db.models import Q
from django.views.generic import TemplateView
from rest_framework.viewsets import ReadOnlyModelViewSet

from schedule.models import Schedule
from schedule.serializers import ScheduleSerializer


class SchedulePageView(TemplateView):
    template_name = "calendar.html"


class ScheduleViewSet(ReadOnlyModelViewSet):
    """
    학사 일정 조회

    - GET /api/schedules/
        → 오늘이 2025-11이라면, 2025년 11월에 걸친 모든 일정

    - GET /api/schedules/?year=2025&month=11
        → 2025년 11월에 걸친 모든 일정

    - GET /api/schedules/?year=2025&month=11&day=2
        → 2025-11-02 날짜에 포함되는 일정들만

    - GET /api/schedules/?year=2025
        → 2025년 전체(시작일 기준)
    """

    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        request = self.request

        year = request.query_params.get("year")
        month = request.query_params.get("month")
        day = request.query_params.get("day")

        # ✅ 1) 특정 날짜 클릭한 경우: 그 날에 포함되는 일정들
        if year and month and day:
            try:
                target = date(int(year), int(month), int(day)) # 실제 존재하는 날짜인지 검사
            except ValueError:
                return qs.none()

            return qs.filter(
                Q(end_date__isnull=True, start_date=target)                # 하루 일정
                | Q(
                    end_date__isnull=False,                               # 기간 일정
                    start_date__lte=target,
                    end_date__gte=target,
                )
            )

        # ✅ 2) year + month : 특정 월에 "걸친" 모든 일정
        if year and month:
            try:
                y = int(year)
                m = int(month)
                first_day = date(y, m, 1) # 해당 월의 첫째 날
                last_day = date(y, m, calendar.monthrange(y, m)[1]) # 해당 월의 마지막 날
            except ValueError:
                return qs.none()

            return qs.filter(
                # 하루 일정: 그 달 안에 있는 날짜
                Q(
                    end_date__isnull=True,
                    start_date__gte=first_day, # 시작일이 11/01 이상
                    start_date__lte=last_day,  # 시작일이 11/30 이하
                )
                |
                # 기간 일정: 해당 달과 기간이 한 번이라도 겹치면 포함
                Q(
                    end_date__isnull=False,
                    start_date__lte=last_day, # 시작일이 11/30보다 앞쪽 ex)10/27
                    end_date__gte=first_day,  # 종료일이 11/01보다 뒤쪽 ex)11/3
                )
            )

        # ✅ 3) year만 있는 경우: 해당 연도(시작일 기준)
        if year and not month and not day:
            return qs.filter(start_date__year=year)

        # ✅ 4) 아무 파라미터도 없을 때: "현재 연/월"에 해당하는 일정
        if not year and not month and not day:
            today = date.today()
            y = today.year
            m = today.month
            first_day = date(y, m, 1)
            last_day = date(y, m, calendar.monthrange(y, m)[1])

            return qs.filter(
                Q(
                    end_date__isnull=True,
                    start_date__gte=first_day,
                    start_date__lte=last_day,
                )
                | Q(
                    end_date__isnull=False,
                    start_date__lte=last_day,
                    end_date__gte=first_day,
                )
            )

        return qs
