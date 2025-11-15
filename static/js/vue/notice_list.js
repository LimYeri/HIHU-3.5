const NoticeListApp = {
    delimiters: ['[[', ']]'],

    data() {
        return {
            postList: [],
            pageCnt: 1,
            curPage: 1,   // 한 페이지당 8개
        };
    },

    computed: {
        pages() {
            let pages3 = [];
            if (this.pageCnt === 1) pages3 = [1];
            else if (this.pageCnt === 2) pages3 = [1, 2];
            else if (this.pageCnt >= 3) {
                if (this.curPage === 1) pages3 = [1, 2, 3];
                else if (this.curPage === this.pageCnt) pages3 = [this.pageCnt-2, this.pageCnt-1, this.pageCnt];
                else pages3 = [this.curPage-1, this.curPage, this.curPage+1];
            }
            return pages3
        },

        prevClass() {
            return this.curPage === 1 ? 'tLightGrey' : 'tBlack';
        },

        nextClass() {
            return this.curPage === this.pageCnt ? 'tLightGrey' : 'tBlack';           
        },
    },

    methods: {
        fetchNotices(page=1) {
            let getUrl = '';
            getUrl = `/api/notices/?page=${page}`;
            axios
                .get(getUrl)
                .then((res) => {
                    this.postList = res.data.postList;
                    this.pageCnt = res.data.pageCnt;
                    this.curPage = res.data.curPage;
                })
                .catch((err) => {
                    console.error('공지 목록 불러오기 실패', err);
                    alert(`${err.response.status} ${err.response.statusText}`);
                });
        },
        formatDate(isoString) {
            if (!isoString) return '';
            const d = new Date(isoString);
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${y}.${m}.${day}`;
        },
        pageChanged(page) {
            this.curPage = page;
            this.fetchNotices(this.curPage);
        },

        prevPage() {
            if (this.curPage <= 1) return;
            else this.curPage = this.curPage - 1;
            this.fetchNotices(this.curPage);
        },

        nextPage() {
            if (this.curPage >= this.pageCnt) return;
            else this.curPage = this.curPage + 1;
            this.fetchNotices(this.curPage);
        },

        pageClass(page) {
            return this.curPage === page ? 'tMain' : 'tGrey';            
        },
    },

    created() {
        this.fetchNotices();
    },
};

Vue.createApp(NoticeListApp).mount('#NoticeListApp');
