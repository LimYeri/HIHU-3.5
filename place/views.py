from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import action
from rest_framework.response import Response

from place.models import Place, PlaceMenu
from place.serializers import (
    PlaceSerializer,
    PlaceMenuSerializer,
    PlaceSimpleSerializer,
)
from django.views.generic import TemplateView

from django.db.models import Q


class PlaceListPageView(TemplateView):
    template_name = "place/place_list.html"


class PlaceDetailPageView(TemplateView):
    template_name = "place/place_detail.html"


# Pagination 설정
class PlacePageNumberPagination(PageNumberPagination):
    page_size = 6  # 한 페이지당 글 개수

    def get_paginated_response(self, data):
        return Response(
            {
                "postList": data,
                "pageCnt": self.page.paginator.num_pages,
                "curPage": self.page.number,
            }
        )


# api/viewset
class PlaceViewSet(ReadOnlyModelViewSet):
    """
    기본 제공:
        - GET /api/places/        -> list
        - GET /api/places/{pk}/   -> retrieve

    추가:
        - GET /api/places/{pk}/menus/  -> 해당 장소의 메뉴만 별도로 조회

    - GET /api/places/?type=restaurant
    - GET /api/places/?search=치킨
    - GET /api/places/?type=bar&search=술 -> 매장 이름 기준
    - GET /api/places/?search=돈까스&search_mode=menu
    - GET /api/places/?type=cafe&search=술&search_mode=menu
    """

    queryset = Place.objects.all().prefetch_related("menus")
    serializer_class = PlaceSerializer
    pagination_class = PlacePageNumberPagination

    # serializer 반환
    def get_serializer_class(self):
        """
        - GET /api/places/?simple=1   -> PlaceSimpleSerializer (왼쪽 리스트용)
        - 그 외                       -> PlaceSerializer (상세/일반용)
        """
        simple = self.request.query_params.get("simple")

        # 목록(list) + simple=1 일 때만 얇은 버전
        if self.action == "list" and simple == "1":
            return PlaceSimpleSerializer
        return PlaceSerializer

    def paginate_queryset(self, queryset):
        """
        simple=1 요청일 때는 페이지네이션을 끈다.
        """
        simple = self.request.query_params.get("simple")
        if simple == "1":
            return None  # 페이지네이션 비활성화
        return super().paginate_queryset(queryset)

    # 리스트 조회 시 type, search, search_mode 필터 적용
    def get_queryset(self):
        qs = super().get_queryset()

        place_type = self.request.query_params.get("type")  # restaurant, cafe, bar, etc
        search = self.request.query_params.get("search")  # 이름 검색
        search_mode = self.request.query_params.get("search_mode")  # 'menu'

        # 타입 필터 (식당/카페/주점)
        if place_type:
            qs = qs.filter(place_type=place_type)

        # 검색어 필터
        if search:
            # 메뉴 기준 검색
            if search_mode == "menu":
                # PlaceMenu.name 또는 menu_type 에 검색어 포함된 가게들
                qs = qs.filter(
                    Q(menus__name__icontains=search)
                    | Q(menus__menu_type__icontains=search)
                ).distinct()

            # 기본: 매장 이름 기준 검색
            else:
                qs = qs.filter(name__icontains=search)

        return qs

    # 특정 장소의 메뉴만 따로 조회
    @action(detail=True, methods=["get"])
    def menus(self, request, pk=None):
        """
        GET /api/place/{pk}/menus/
        특정 장소의 메뉴만 따로 보고 싶을 때
        """
        place = self.get_object()
        menus = place.menus.select_related("place").all()  # related_name='menus'
        serializer = PlaceMenuSerializer(menus, many=True)
        return Response(serializer.data)

    def get_serializer_context(self):
        """
        Extra context provided to the serializer class.
        """
        return {
            "request": None,  # 이미지 필드 Full URL이 아닌 상대 경로로 반환하기 위해 None 설정
            "format": self.format_kwarg,
            "view": self,
        }
