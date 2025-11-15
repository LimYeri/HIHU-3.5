// 메인 (학사일정 2개, 공지 1개)
const { createApp } = Vue;

// ⭐ 메인 요약용 Vue 앱
const MainApp = {
    delimiters: ["[[", "]]"],
    data() {
        return {
            todaySchedules: [],   // 오늘 기준 포함/이후 일정 2개
            latestNotice: null,   // 최신 HIHU 공지 1개
            loading: false,
            error: null,
        };
    },
    created() {
        this.fetchMainSummary();
    },
    methods: {
        async fetchMainSummary() {
            this.loading = true;
            this.error = null;
            try {
                const res = await axios.get("/api/main/"); // 우리가 만든 메인 API
                this.todaySchedules = res.data.today_schedules || [];
                this.latestNotice = res.data.latest_notice || null;
            } catch (err) {
                console.error(err);
                this.error = "메인 데이터를 불러오지 못했습니다.";
            } finally {
                this.loading = false;
            }
        },
        // "YYYY-MM-DD" -> "YYYY.MM.DD" 로 포맷
        formatDate(dateStr) {
            if (!dateStr) return "";
            const [y, m, d] = dateStr.split("-");
            return `${y}.${m}.${d}`;
        },
        // 🔹 공지 디테일 페이지 링크 생성: /notices/{id}/
        noticeDetailUrl(notice) {
            if (!notice || !notice.id) {
                return "/notices/"; // id 없으면 리스트로라도 보내기
            }
            return `/notices/${notice.id}/`;
        },
    },
};

// ⭐ DOM 로드 후 두 개의 앱을 각각 마운트
document.addEventListener("DOMContentLoaded", () => {
    const mainEl = document.getElementById("MainApp");
    if (mainEl) {
        createApp(MainApp).mount("#MainApp");
    }
});
