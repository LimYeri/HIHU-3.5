from django.contrib import admin
from .models import Place, PlaceMenu


class PlaceMenuInline(admin.TabularInline):
    model = PlaceMenu
    extra = 1              # 기본으로 빈 폼 몇 개 보여줄지
    fields = ('name', 'menu_type', 'price')
    # readonly_fields = ()  # 필요하면 나중에 읽기 전용 필드 넣어도 됨


@admin.register(Place)
class PlaceAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'place_type',
        'name',
        'address',
        'phone',
        'opening_hours',
    )
    list_display_links = ('id', 'name')
    list_filter = ('place_type',)          # 식당/카페/주점 필터
    search_fields = ('name', 'address')    # 검색 박스
    inlines = [PlaceMenuInline]            # Place 아래에서 메뉴 바로 입력
    ordering = ('name',)                   # 이름순 정렬

    fieldsets = (
        ('기본 정보', {
            'fields': ('name', 'place_type', 'address', 'phone'),
        }),
        ('추가 정보', {
            'fields': ('opening_hours', 'location_link', 'image'),
            # 'classes': ('collapse',),  # 접어서 보기
        }),
    )


@admin.register(PlaceMenu)
class PlaceMenuAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'place',
        'name',
        'menu_type',
        'price',
    )
    list_display_links = ('id', 'name')
    search_fields = ('name', 'place__name')
    list_filter = ('menu_type',)  # 완전 자유 입력이라 필터는 선택사항
    ordering = ('place', 'name')
