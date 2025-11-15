const NoticeDetailApp = {
    delimiters: ['[[', ']]'],

    data() {
        return {
            post: {},
            prevPost: {},
            nextPost: {},
        };
    },

    computed: {
        // 내용 줄바꿈(\r\n, \n)을 <br>로 바꿔서 표시
        formattedContent() {
            if (!this.post || !this.post.content) return '';
            return this.post.content.replace(/\r?\n/g, '<br>');
        },
    },

    methods: {
        fetchNoticeDetail(postId) {
            axios
                .get(`/api/notices/${postId}/`)
                .then((res) => {
                    this.post = res.data.post;
                    this.prevPost = res.data.prevPost;
                    this.nextPost = res.data.nextPost;
                })
                .catch((err) => {
                    console.error('공지 상세 불러오기 실패', err);
                    alert(`${err.response.status} ${err.response.statusText}`);
                });
        },

        formatDate(isoString) {
            if (!isoString) return '';
            const d = new Date(isoString);
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${y}-${m}-${day}`;
        },
    },

    created() {
        const postId = location.pathname.split('/')[2];
        this.fetchNoticeDetail(postId);
    },
};

Vue.createApp(NoticeDetailApp).mount('#NoticeDetailApp');