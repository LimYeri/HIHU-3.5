from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from notice.models import Notice
from notice.serializers import NoticeSerializer, NoticeSerializerDetail

from django.views.generic import TemplateView


class NoticeListPageView(TemplateView):
    template_name = "notice/notice_list.html"

class NoticeDetailPageView(TemplateView):
    template_name = "notice/notice_detail.html"


# Pagination 설정
class NoticePageNumberPagination(PageNumberPagination):
    page_size = 8 # 한 페이지당 글 개수
    
    def get_paginated_response(self, data):
        return Response({
            'postList': data,
            'pageCnt': self.page.paginator.num_pages,
            'curPage': self.page.number,
        })

# 이전/다음 글 가져오기 함수
def get_prev_next(instance):
    try:
        prev = instance.get_previous_by_created_at()
    except instance.DoesNotExist:
        prev = None

    try:
        next_ = instance.get_next_by_created_at()
    except instance.DoesNotExist:
        next_ = None

    return prev, next_


# api/viewset
class NoticeViewSet(ReadOnlyModelViewSet):
    queryset = Notice.objects.all()
    serializer_class = NoticeSerializer  # 기본값은 리스트/기본 직렬화용
    pagination_class = NoticePageNumberPagination
    
    def get_serializer_class(self):
        # action에 따라 다른 serializer 반환
        if self.action == 'retrieve':
            return NoticeSerializerDetail  # 필요시 상세 전용 serializer
        return NoticeSerializer
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        prevInstance, nextInstance = get_prev_next(instance)
        data = {
            'post': instance,
            'prevPost': prevInstance,
            'nextPost': nextInstance,
        }
        serializer = self.get_serializer(instance=data)
        return Response(serializer.data)
    
    def get_serializer_context(self):
        """
        Extra context provided to the serializer class.
        """
        return {
            'request': None, # 이미지 필드 Full URL이 아닌 상대 경로로 반환하기 위해 None 설정
            'format': self.format_kwarg,
            'view': self
        }

