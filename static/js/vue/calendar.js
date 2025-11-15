const { createApp } = Vue;

const ScheduleApp = {
    delimiters: ["[[", "]]"],

    data() {
        return {
            year: null,              // 현재 연도
            month: null,             // 현재 월 (1~12)
            selectedDay: null,       // 선택된 날짜 (숫자)
            calendarDays: [],        // 캘린더에 그릴 날짜 정보 배열
            monthEvents: [],         // 해당 월과 겹치는 모든 일정
            schedules: [],           // 오른쪽 리스트에 표시할 일정
            loading: false,
            error: null,
            today: null,             // 오늘 날짜 객체
        };
    },

    created() {
        const now = new Date();
        this.year = now.getFullYear();
        this.month = now.getMonth() + 1; // JS는 0~11, 우리는 1~12
        this.today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        this.fetchMonthEvents();
    },

    methods: {
        async fetchMonthEvents() {
            this.loading = true;
            this.error = null;
            this.selectedDay = null;

            // ✅ 요청 시작할 때 바로 초기화
            this.schedules = [];

            try {
                const res = await axios.get("/api/schedules/", {
                    params: {
                        year: this.year,
                        month: this.month,
                    },
                });

                this.monthEvents = res.data;
                // 기본은 "해당 월 전체 일정"을 리스트에 표시
                this.schedules = res.data;
                this.buildCalendarDays();
            } catch (err) {
                console.error(err);
                this.error = "일정을 불러오지 못했습니다.";
            } finally {
                this.loading = false;
            }
        },

        async fetchDayEvents(dayObj) {
            if (!dayObj.inCurrentMonth) {
                return;
            }

            this.selectedDay = dayObj.day;
            this.loading = true;
            this.error = null;

            // ✅ 날짜 클릭한 순간, 기존 리스트 비우기
            this.schedules = [];

            try {
                const res = await axios.get("/api/schedules/", {
                    params: {
                        year: this.year,
                        month: this.month,
                        day: this.selectedDay,
                    },
                });

                // ✅ 새 데이터로 완전히 교체
                this.schedules = res.data;
            } catch (err) {
                console.error(err);
                this.error = "해당 날짜의 일정을 불러오지 못했습니다.";

                // ✅ 에러일 때도 이전 일정은 안 보이게 하고 싶다면
                // this.schedules = [];
            } finally {
                this.loading = false;
            }
        },


        // 캘린더용 날짜 데이터 구성
        buildCalendarDays() {
            const days = [];

            const year = this.year;
            const monthIndex = this.month - 1; // JS Date용: 0~11

            const firstDay = new Date(year, monthIndex, 1);
            const lastDay = new Date(year, monthIndex + 1, 0);
            const daysInMonth = lastDay.getDate();

            // 월요일 기준 요일 인덱스 (0=월, 6=일)
            const firstWeekday = (firstDay.getDay() + 6) % 7;

            // 이전 달 정보
            const prevLastDay = new Date(year, monthIndex, 0);
            const daysInPrevMonth = prevLastDay.getDate();

            // 📌 이전 달 날짜 채우기
            for (let i = firstWeekday; i > 0; i--) {
                const dayNum = daysInPrevMonth - i + 1;
                days.push({
                    key: `prev-${dayNum}`,
                    day: dayNum,
                    inCurrentMonth: false,
                    type: "prev",
                    isToday: false,
                    hasEvents: false,
                });
            }

            // 📌 이번 달 날짜 채우기
            for (let d = 1; d <= daysInMonth; d++) {
                const currentDate = new Date(year, monthIndex, d);

                const isToday =
                    currentDate.getTime() === this.today.getTime();

                // 이 날짜를 "YYYY-MM-DD" 문자열로 만들기
                const mm = String(this.month).padStart(2, "0");
                const dd = String(d).padStart(2, "0");
                const currentStr = `${this.year}-${mm}-${dd}`;

                // 이 날짜에 이벤트가 있는지 체크
                let hasEvents = false;
                for (const ev of this.monthEvents) {
                    const startStr = ev.start_date;              // "2025-11-17"
                    const endStr = ev.end_date || null;          // null 또는 "2025-11-21"

                    if (!endStr) {
                        // 하루 일정
                        if (startStr === currentStr) {
                            hasEvents = true;
                            break;
                        }
                    } else {
                        // 기간 일정: start <= current <= end (문자열 비교 가능)
                        if (startStr <= currentStr && endStr >= currentStr) {
                            hasEvents = true;
                            break;
                        }
                    }
                }

                days.push({
                    key: `curr-${d}`,
                    day: d,
                    inCurrentMonth: true,
                    type: "current",
                    isToday,
                    hasEvents,
                });
            }

            // 📌 다음 달 날짜로 마지막 주 채우기
            const remainder = days.length % 7;
            if (remainder !== 0) {
                const nextCount = 7 - remainder;
                for (let d = 1; d <= nextCount; d++) {
                    days.push({
                        key: `next-${d}`,
                        day: d,
                        inCurrentMonth: false,
                        type: "next",
                        isToday: false,
                        hasEvents: false,
                    });
                }
            }

            this.calendarDays = days;
        },

        isSameDate(a, b) {
            return (
                a.getFullYear() === b.getFullYear() &&
                a.getMonth() === b.getMonth() &&
                a.getDate() === b.getDate()
            );
        },

        dayClasses(day) {
            return {
                prev: day.type === "prev",
                next: day.type === "next",
                current: day.inCurrentMonth,
                today: day.isToday,
                haveList: day.inCurrentMonth && day.hasEvents,
                nonList: day.inCurrentMonth && !day.hasEvents,
                able: day.inCurrentMonth,
                disable: !day.inCurrentMonth,
                selected:
                    day.inCurrentMonth &&
                    this.selectedDay === day.day,
            };
        },

        onClickDay(day) {
            // 현재 달에 속한 날짜만 클릭 가능
            if (!day.inCurrentMonth) return;
            this.fetchDayEvents(day);
        },

        goPrevMonth() {
            if (this.month === 1) {
                this.month = 12;
                this.year -= 1;
            } else {
                this.month -= 1;
            }
            this.fetchMonthEvents();
        },

        goNextMonth() {
            if (this.month === 12) {
                this.month = 1;
                this.year += 1;
            } else {
                this.month += 1;
            }
            this.fetchMonthEvents();
        },

        // "YYYY-MM-DD" -> "YYYY년 M월 D일"
        formatDateKorean(dateStr) {
            if (!dateStr) return "";
            const [y, m, d] = dateStr.split("-");
            return `${y}년 ${parseInt(m, 10)}월 ${parseInt(d, 10)}일`;
        },
    },
};

document.addEventListener("DOMContentLoaded", () => {
    const el = document.getElementById("ScheduleApp");
    if (el) {
        createApp(ScheduleApp).mount("#ScheduleApp");
    }
});
