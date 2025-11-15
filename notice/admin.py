from django.contrib import admin
from notice.models import Notice


@admin.register(Notice)
class NoticeAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "created_at")
    list_display_links = ("id", "title")
    search_fields = ("title", "content")
    list_filter = ("created_at",)
