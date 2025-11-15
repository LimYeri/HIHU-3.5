from django.db import models


class Notice(models.Model):
    title = models.CharField("제목", max_length=100)
    content = models.TextField("내용")
    created_at = models.DateTimeField("작성 시간", auto_now_add=True)
    image = models.ImageField("이미지", upload_to='notice/', blank=True, null=True)

    class Meta:
        ordering = ['created_at']  # 기본 정렬: 작성 시간 오름차순
        
    def __str__(self) -> str:
        return self.title