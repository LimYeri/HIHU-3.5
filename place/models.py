from django.db import models


class Place(models.Model):
    # 장소 타입 (restaurant, cafe, bar 등)
    PLACE_TYPE_CHOICES = [
        ('restaurant', '식당'),
        ('cafe', '카페'),
        ('bar', '주점'),
    ]

    name = models.CharField(max_length=50)  # 장소명
    address = models.CharField(max_length=300)  # 주소
    phone = models.CharField(max_length=20, blank=True)  # 전화번호
    opening_hours = models.CharField(max_length=200, blank=True)  # 영업시간
    image = models.ImageField(upload_to='place/', blank=True, null=True)  # 대표 이미지
    location_link = models.URLField(blank=True, null=True)  # 지도 링크
    place_type = models.CharField(max_length=20, choices=PLACE_TYPE_CHOICES)

    class Meta:
        ordering = ['name']  # 기본 정렬: name 오름차순

    def __str__(self) -> str:
        return self.name


class PlaceMenu(models.Model):
    place = models.ForeignKey(
        Place, on_delete=models.CASCADE, related_name='menus'
    )
    name = models.CharField(max_length=50)  # 메뉴명
    menu_type = models.CharField(max_length=50, blank=True)
    price = models.PositiveIntegerField()

    def __str__(self) -> str:
        return f"{self.place.name} - {self.name}"
