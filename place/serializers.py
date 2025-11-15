from rest_framework import serializers
from place.models import Place, PlaceMenu


class PlaceMenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlaceMenu
        fields = ['id', 'name', 'menu_type', 'price']


class PlaceSerializer(serializers.ModelSerializer):
    # related_name='menus' 로 연결된 메뉴들
    menus = PlaceMenuSerializer(many=True, read_only=True)

    class Meta:
        model = Place
        fields = [
            'id',
            'name',
            'address',
            'phone',
            'opening_hours',
            'image',
            'location_link',
            'place_type',
            'menus',
        ]

class PlaceSimpleSerializer(serializers.ModelSerializer):
    """왼쪽 리스트용: id + name 정도만 가볍게"""

    class Meta:
        model = Place
        fields = ["id", "name"]