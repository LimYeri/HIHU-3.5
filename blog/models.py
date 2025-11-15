from django.db import models


class Banner(models.Model):
    title = models.CharField("메인 문구", max_length=100)
    subtitle = models.CharField("서브 제목(위)", max_length=200, blank=True)
    description = models.CharField("설명 문구(밑)", max_length=255, blank=True)

    image = models.ImageField("배너 이미지", upload_to="banner/")  # media/banner/...
    
    class Meta:
        ordering = ['id']  # 기본 정렬: id 오름차순
    
    def __str__(self) -> str:
        return self.title   