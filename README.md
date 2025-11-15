###### 개인 프로젝트 

# HIHU 3.5 🏫

캠퍼스 근처 식당 · 카페 · 주점 · 동아리 · 학사 일정 정보를 한 곳에서 조회할 수 있는  
한서대학교 기반 로컬 정보 플랫폼 **HIHU**의 리뉴얼 버전입니다.

기존 HIHU 3.0은 서버 렌더링 기반의 Django 템플릿 중심 구조였다면,  
**HIHU 3.5는 Django REST Framework + Vue 조합으로 API 중심 구조로 재설계**되었습니다.

---

## 🧩 Tech Stack

| 구분 | 기술 스택 |
|------|-----------|
| **Backend** | Django, Django REST Framework (DRF), Django ORM |
| **Frontend** | Vue 3 (CDN), Axios, Django Template + Vue 혼합 구조 |
| **Environment** | **uv** (Python 패키지/환경 관리) |
| **Language** | Python 3.13 |


---

## ✨ 주요 변경 사항 (HIHU 3.0 → 3.5 기술 업데이트)

### 1. 도메인 중심 설계로 앱 구조 통합

기존에는 `restaurant`, `cafe`, `bar` 각각에 별도 모델/앱이 존재했지만,  
3.5에서는 이를 **단일 Place 도메인으로 통합**했습니다.

- `Place`  
  - 매장 공통 정보 (`name`, `address`, `phone`, `opening_hours`, `place_type`, `image`, `location_link` 등)
  - `place_type` 필드로 `restaurant / cafe / bar` 구분
- `PlaceMenu`  
  - `ForeignKey(Place, related_name="menus")`
  - `name`, `menu_type`, `price` 등 메뉴 정보

<br>

### 2. Notice(공지) 도메인 API 설계

공지사항을 DRF 기반으로 재구성해, 조회 중심 API로 구현했습니다.

- 공지 목록 조회  
- 공지 상세 조회  
- 이전/다음 글 정보 제공  
- 공지 콘텐츠 + 이미지 필드 지원  
- Vue 기반 게시글 상세 페이지 렌더링

<br>

### 3. Schedule(학사 일정) 도메인 API 설계

학사 일정 데이터를 DRF ViewSet으로 제공하며,  
연·월 기반 필터링을 적용해 특정 달의 일정만 효율적으로 조회할 수 있도록 만들었습니다.

- 연/월 단위 일정 조회  
- 일정 제목, 시작일, 종료일 정보 제공  
- Vue 기반 캘린더 UI와 연동  
- 월 이동 시 자동 API 호출

<br>

### 4. 검색 및 필터 기능 고도화 (Place)

단일 엔드포인트(`/api/places/`)에서 다양한 검색 조건을 조합해 사용할 수 있습니다.

- 매장 유형 필터링 (`type=restaurant/cafe/bar`)
- 매장 이름 검색 (`search=치킨`)
- 메뉴 검색 (`search_mode=menu`)
- 메뉴 이름 + 메뉴 타입 검색
- 유형 + 이름 + 메뉴 검색 조합 가능

<br>

### 5. Vue 기반 프론트엔드 구조 도입

기존의 jQuery/단순 스크립트 기반 구조를 정리하고 **Vue 3**를 도입했습니다.

- 페이지별로 독립적인 Vue 앱을 마운트 (예: `PlaceListApp`, `PlaceDetailApp` 등)
- Axios를 통해 DRF API와 통신
- 검색/필터/리스트/상세 화면을 Vue 상태로 관리
- Django 템플릿과의 태그 충돌을 피하기 위해 Vue delimiters 변경

---

## 🔍 Advanced Query Optimization

### ■ ORM 최적화 적용

HIHU 3.5에서는 Django ORM 수준에서 기본적인 성능 튜닝을 적용했습니다.

- `Place` 조회 시 `prefetch_related("menus")`를 기본 적용해  
  매장 목록/상세 조회에서 발생할 수 있는 **N+1 쿼리 문제를 완화**
- 메뉴 기준 검색 시 JOIN으로 인해 발생할 수 있는 중복 레코드는  
  `.distinct()`로 정리해 **결과 데이터의 정확성 보장**
- 메뉴 전용 조회 API에서는 필요에 따라 `select_related("place")`를 사용해  
  메뉴와 매장 정보를 함께 접근할 때의 쿼리 수를 줄이는 방향으로 설계


### ■ 지원 검색 유형 정리

아래와 같은 다양한 검색 조합을 지원합니다.

- 매장 유형 필터: `type=restaurant / cafe / bar ...`
- 매장 이름 키워드 검색: `search=치킨`
- 메뉴 이름 검색: `search=돈까스&search_mode=menu`
- 메뉴 카테고리 검색: `search=COFFEE&search_mode=menu`
- 유형 + 메뉴 검색: `type=cafe&search=술&search_mode=menu`

---

## 📂 프로젝트 구조 (요약)

- Django 프로젝트: 설정 및 전역 URL 라우팅
- 앱 단위 분리:
  - `place` – 매장·메뉴 도메인 API  
  - `notice` – 공지 도메인 API (리스트/상세/이전·다음 글)  
  - `schedule` – 학사 일정 API (월별 기반 필터링)  
  - `blog` – 메인 배너/공통 요소 등
- `templates/` – Vue 마운트용 템플릿  
- `static/js/vue/` – 페이지 단위 Vue 앱 
- `static/css/`, `static/img/` – 스타일 및 정적 자원
  

---

## 📘 참고 자료 (HIHU 3.0)

HIHU 프로젝트의 시작 배경, 초기 목표, 서비스 기획 의도 등  
보다 자세한 스토리가 궁금하다면 **HIHU 3.0 README**를 참고해주세요.

👉 [*(HIHU 3.0 README 보기)*  ](https://github.com/LimYeri/HIHU-3.0)