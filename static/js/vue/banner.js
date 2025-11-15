const SlideBannerApp = {
    delimiters: ['[[', ']]'],
    data() {
        return {
            slides: [],
            currentIndex: 0,
            isPlaying: true,
            slideInterval: null,
        };
    },
    computed: {
        currentSlide() {
            return this.slides[this.currentIndex] || {};
        },
        pageText() {
            return `${this.currentIndex + 1} / ${this.slides.length}`;
        },
        sliderStyle() {
            // 예전 slidebanner.js 의 slides.style.left = -num * 100 + 'vw' 대신
            return {
                left: `-${this.currentIndex * 100}vw`,
                transition: 'left 0.4s ease',
            };
        },
    },
    created() {
        this.fetchSlides();
    },
    methods: {
        fetchSlides() {
            axios.get("/api/banners/")
                .then(res => {
                    this.slides = res.data;
                    if (this.slides.length > 0) {
                        this.startAutoSlide();
                    }
                })
                .catch(err => {
                    console.error("배너 불러오기 실패", err);
                });
        },
        nextSlide() {
            if (this.slides.length === 0) return;
            this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        },
        prevSlide() {
            if (this.slides.length === 0) return;
            this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        },
        startAutoSlide() {
            if (this.slideInterval) clearInterval(this.slideInterval);
            this.slideInterval = setInterval(() => {
                if (this.isPlaying) {
                    this.nextSlide();
                }
            }, 5000);
        },
        togglePlay() {
            this.isPlaying = !this.isPlaying;
        }
    },
    beforeUnmount() {
        if (this.slideInterval) clearInterval(this.slideInterval);
    }
};

Vue.createApp(SlideBannerApp).mount("#slideBannerApp");

