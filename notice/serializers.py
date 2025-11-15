from rest_framework import serializers
from notice.models import Notice


class NoticeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notice
        fields = ["id", "title", "content", "created_at", "image"]

class NoticeSerializerSub(serializers.ModelSerializer):
    class Meta:
        model = Notice
        fields = ['id', 'title']


class NoticeSerializerDetail(serializers.Serializer):
    post = NoticeSerializer()
    prevPost = NoticeSerializerSub()
    nextPost = NoticeSerializerSub()