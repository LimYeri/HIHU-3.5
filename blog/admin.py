from django.contrib import admin
from blog.models import Banner


@admin.register(Banner)
class MainBannerAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "subtitle", "description", "image")
    search_fields = ("title",)