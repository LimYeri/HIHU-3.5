axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';

const PlaceListApp = {
    delimiters: ['[[', ']]'],

    data() {
        return {
            placeList: [],    // 가게 리스트
            pageCnt: 1,       // 전체 페이지 수
            curPage: 1,       // 현재 페이지

            typeParam: '',    // ?type=
            searchParam: '',  // ?search=
            searchInput: '',  // 검색창 v-model

            mainTitle: '가게',
            pageRange: [],    // [1, 2, 3, ...]
        };
    },

    created() {
        this.initParamsFromUrl();
        this.fetchPlaceList();
    },

    methods: {
        // URL에서 type, search, page 읽어오기
        initParamsFromUrl() {
            const params = new URLSearchParams(window.location.search);

            this.typeParam = params.get('type') || '';
            this.searchParam = params.get('search') || '';

            // 🔹 search_mode 읽기 (shop / menu)
            const urlMode = params.get('search_mode');
            if (urlMode === 'menu') {
                this.searchMode = 'menu';
            } else {
                this.searchMode = 'shop';
            }

            const page = parseInt(params.get('page') || '1', 10);
            this.curPage = isNaN(page) || page < 1 ? 1 : page;

            this.searchInput = this.searchParam;  // 검색창에 현재 검색어 반영
            this.updateMainTitle();
        },

        // 메인 타이틀 설정
        updateMainTitle() {
            if (this.searchParam) {
                // 🔹 메뉴 검색인지, 매장 검색인지에 따라 문구 살짝 다르게
                if (this.searchMode === 'menu') {
                    this.mainTitle = `"${this.searchParam}" 메뉴 검색 결과`;
                } else {
                    this.mainTitle = `"${this.searchParam}" 매장 검색 결과`;
                }
                return;
            }

            if (this.typeParam) {
                const typeMap = {
                    restaurant: '식당',
                    cafe: '카페',
                    bar: '주점',
                };
                this.mainTitle = typeMap[this.typeParam] || '가게';
                return;
            }

            // 기본: 전체 가게
            this.mainTitle = '가게';
        },

        // API 호출해서 리스트 가져오기
        fetchPlaceList() {
            const params = {};

            if (this.typeParam) {
                params.type = this.typeParam;
            }
            if (this.searchParam) {
                params.search = this.searchParam;

                // 🔹 검색어가 있을 때만 search_mode 전송
                if (this.searchMode === 'menu') {
                    params.search_mode = 'menu';
                }
                // shop일 때는 안 보내면 -> 기본 매장 검색
            }
            if (this.curPage && this.curPage > 1) {
                params.page = this.curPage;
            }

            axios.get('/api/places/', { params })
                .then(res => {
                    // DRF Pagination 커스텀 응답 형식:
                    // { postList: [...], pageCnt: n, curPage: m }
                    this.placeList = res.data.postList || [];
                    this.pageCnt = res.data.pageCnt || 1;
                    this.curPage = res.data.curPage || 1;

                    // 페이지 번호 배열 생성
                    this.pageRange = Array.from(
                        { length: this.pageCnt },
                        (_, i) => i + 1
                    );
                })
                .catch(err => {
                    console.error('PLACE LIST ERROR', err);
                    this.placeList = [];
                    this.pageCnt = 1;
                    this.curPage = 1;
                    this.pageRange = [1];
                });
        },

        // 페이지 이동 (쿼리스트링 유지하면서 page만 변경)
        goToPage(page) {
            if (page < 1 || page > this.pageCnt || page === this.curPage) {
                return;
            }

            const params = new URLSearchParams();

            if (this.typeParam) {
                params.set('type', this.typeParam);
            }
            if (this.searchParam) {
                params.set('search', this.searchParam);

                // 🔹 검색 중일 때 search_mode 유지
                if (this.searchMode === 'menu') {
                    params.set('search_mode', 'menu');
                }
            }
            if (page > 1) {
                params.set('page', page);
            }

            const qs = params.toString();
            const base = window.location.pathname;

            // URL을 바꾸고 새로고침 -> Vue가 다시 파라미터 읽고 fetch
            window.location.href = qs ? `${base}?${qs}` : base;
        },

        // 검색 실행
        // - type이 있으면 유지 (예: ?type=cafe&search=술)
        // - 검색어 없으면 search 파라미터 제거해서 type만 유지 or 전체
        onSubmitSearch() {
            const keyword = this.searchInput.trim();

            const params = new URLSearchParams();

            if (this.typeParam) {
                params.set('type', this.typeParam);
            }
            if (keyword) {
                params.set('search', keyword);

                // 🔹 메뉴 검색일 때만 search_mode=menu 붙이기
                if (this.searchMode === 'menu') {
                    params.set('search_mode', 'menu');
                }
            }

            const qs = params.toString();
            const base = window.location.pathname;

            window.location.href = qs ? `${base}?${qs}` : base;
        },

        // place_type -> 한글 변환
        getPlaceTypeKorean(type) {
            const map = {
                restaurant: '식당',
                cafe: '카페',
                bar: '주점',
            };
            return map[type] || '';
        },

        // 상세 페이지 URL (실제 URL 패턴에 맞게 수정해서 사용하면 됨)
        getPlaceDetailUrl(place) {
            const params = new URLSearchParams(window.location.search); // ?type=cafe&search=...
            const qs = params.toString(); // "type=cafe&search=..."

            return qs ? `/places/${place.id}/?${qs}` : `/places/${place.id}/`;
        },
    },
};

Vue.createApp(PlaceListApp).mount('#PlaceListApp');