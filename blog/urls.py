from django.urls import path

from blog.views import BannerListAPIView, MainSummaryView, HomeView, AboutPageView

urlpatterns = [
    path("", HomeView.as_view(), name="home"),
    path("about/", AboutPageView.as_view(), name="about"),
    path("api/main/", MainSummaryView.as_view(), name="main-summary"),
    path("api/banners/", BannerListAPIView.as_view(), name="banner-list"),
]
