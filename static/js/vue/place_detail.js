// js/vue/place_list.js

const { createApp } = Vue;

const PlaceDetailApp = {
    delimiters: ["[[", "]]"],

    data() {
        return {
            shopKind: "",      // 상단 제목 (식당 / 카페 / 주점 / 전체 등)
            shopList: [],      // 왼쪽 리스트 (simple=1로 불러온 매장 목록)
            shopDetail: {},    // 오른쪽 상세 (선택된 매장)
        };
    },

    computed: {
        // 메뉴를 menu_type 기준으로 묶기
        groupedMenus() {
            const grouped = {};
            if (!this.shopDetail || !this.shopDetail.menus) {
                return grouped;
            }

            this.shopDetail.menus.forEach((m) => {
                const key = m.menu_type || "기타";
                if (!grouped[key]) {
                    grouped[key] = [];
                }
                grouped[key].push(m);
            });

            return grouped;
        },
    },

    created() {
        const placeId = this.getPlaceIdFromPath();

        // URL ?type=restaurant/cafe/bar 에 따라 shopKind 설정
        this.setShopKindFromTypeParam();

        // 왼쪽 리스트용 전체 매장(simple=1) 불러오기
        this.fetchShopList();

        // 상세 정보 불러오기
        if (placeId) {
            this.fetchShopDetail(placeId);
        }
    },

    methods: {
        // URL에서 place id 추출
        // 예: /place/2/  or  /place/detail/2/
        getPlaceIdFromPath() {
            const parts = window.location.pathname
                .split("/")
                .filter((p) => p.length > 0);

            // 마지막 segment가 숫자면 그걸 id로 간주
            const last = parts[parts.length - 1];
            const num = parseInt(last, 10);
            if (!isNaN(num)) {
                return num;
            }
            return null;
        },

        // ?type=restaurant|cafe|bar 에 따라 상단 제목 설정
        setShopKindFromTypeParam() {
            const params = new URLSearchParams(window.location.search);
            const type = params.get("type");

            if (type === "restaurant") {
                this.shopKind = "식당";
            } else if (type === "cafe") {
                this.shopKind = "카페";
            } else if (type === "bar") {
                this.shopKind = "주점";
            } else {
                this.shopKind = "전체 매장";
            }
        },

        // 왼쪽 리스트용 매장 목록 불러오기 (simple=1 → PlaceSimpleSerializer)
        fetchShopList() {
            const params = new URLSearchParams(window.location.search);
            params.set("simple", "1");  // simple 모드

            axios
                .get("/api/places/", {
                    params: Object.fromEntries(params.entries()),
                })
                .then((res) => {
                    // simple=1 + pagination 끔 → 단순 리스트 형태로 내려옴
                    this.shopList = res.data;
                })
                .catch((err) => {
                    console.error("fetchShopList error:", err);
                });
        },

        // 특정 매장 상세 불러오기
        fetchShopDetail(id) {
            axios
                .get(`/api/places/${id}/`)
                .then((res) => {
                    this.shopDetail = res.data;
                })
                .catch((err) => {
                    console.error("fetchShopDetail error:", err);
                });
        },

        // 왼쪽 리스트에서 현재 선택된 매장인지 판단
        isActiveShop(shop) {
            return this.shopDetail && this.shopDetail.id === shop.id;
        },

        // 상세 페이지 URL 생성
        // 실제 URL 패턴에 맞게 필요하면 '/place/detail/' 등으로 수정해도 됨
        getShopUrl(id) {
            const params = new URLSearchParams(window.location.search);
            const q = params.toString();
            // 예: /place/2/?type=cafe
            return q ? `/places/${id}/?${q}` : `/places/${id}/`;
        },

        // 가격에 천 단위 , 찍기
        formatPrice(price) {
            if (price === null || price === undefined) {
                return "";
            }
            try {
                return Number(price).toLocaleString("ko-KR");
            } catch (e) {
                return price;
            }
        },
    },
};

// detail 페이지에만 mount
document.addEventListener("DOMContentLoaded", () => {
    const el = document.getElementById("PlaceDetailApp");
    if (el) {
        createApp(PlaceDetailApp).mount("#PlaceDetailApp");
    }
});
