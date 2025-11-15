from django.db import models


class Schedule(models.Model):
    title = models.CharField("이벤트", max_length=200)
    start_date = models.DateField("시작일")
    end_date = models.DateField("마감일", null=True, blank=True)

    class Meta:
        ordering = ["start_date", "title"]

    def __str__(self) -> str:
        # 종료일이 있으면 기간 표시, 없으면 단일 날짜
        if self.end_date and self.end_date != self.start_date:
            return f"{self.title} ({self.start_date} ~ {self.end_date})"
        return f"{self.title} ({self.start_date})"
