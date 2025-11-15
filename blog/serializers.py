from rest_framework import serializers

from blog.models import Banner
from schedule.models import Schedule
from notice.models import Notice 

class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = ["id", "title", "subtitle", "description", "image"]

# 홈 화면 (일정 2개)
class ScheduleMainSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = ["id", "title", "start_date", "end_date"]  # 메인에는 이 정도면 충분

# 홈 화면 (최근 공지 1개)
class NoticeMainSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notice
        fields = ["id", "title", "created_at"]