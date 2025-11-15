from django.contrib import admin
from .models import Schedule


@admin.register(Schedule)
class ScheduleAdmin(admin.ModelAdmin):
    list_display = ("title", "formatted_start_date", "formatted_end_date")
    list_filter = ("start_date", "end_date")
    search_fields = ("title",)
    
    def formatted_start_date(self, obj):
        return obj.start_date.strftime("%Y-%m-%d")
    formatted_start_date.short_description = "시작일"

    def formatted_end_date(self, obj):
        if obj.end_date:
            return obj.end_date.strftime("%Y-%m-%d")
        return "-"
    formatted_end_date.short_description = "종료일"
