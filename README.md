# IBK 마음건강검진 Frontend

IBK 마음건강검진 시스템의 Next.js 기반 프론트엔드 애플리케이션입니다. 직원들의 정신 건강 관리와 상담 서비스를 위한 현대적이고 사용자 친화적인 웹 애플리케이션입니다.

## 🚀 주요 기능

### 🔐 인증 및 보안

- **세션 기반 인증**: 안전한 로그인/로그아웃 시스템
- **권한 관리**: 역할 기반 접근 제어 (RBAC)
- **자동 세션 체크**: 페이지 이동 시 자동 인증 상태 확인

### 📱 현대적 UI/UX

- **반응형 디자인**: 모바일, 태블릿, 데스크톱 완벽 지원
- **다크/라이트 모드**: 사용자 선호도에 따른 테마 전환
- **애니메이션**: 부드러운 전환 효과와 인터랙션
- **접근성**: WCAG 2.1 AA 준수

### 🎯 핵심 서비스

- **마음건강검진**: 체계적인 정신 건강 진단 시스템
- **상담 신청**: 전문가와의 1:1 상담 예약
- **챌린지 프로그램**: 건강한 습관 형성 도전
- **자료실**: 정신 건강 관련 유용한 정보 제공

### 🛠️ 관리자 기능

- **대시보드**: 실시간 통계 및 현황 모니터링
- **사용자 관리**: 직원 정보 및 권한 관리
- **프로그램 관리**: 검진 및 상담 프로그램 운영
- **통계 분석**: 상세한 데이터 분석 및 리포트

## 🛠️ 기술 스택

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript/JavaScipt
- **Styling**: Tailwind CSS + Styled Components
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **UI Components**: Custom Component Library

### Development Tools

- **Package Manager**: npm
- **Linting**: ESLint
- **Code Formatting**: Prettier
- **Type Checking**: TypeScript
- **Build Tool**: Next.js (Webpack)

### Backend Integration

- **API**: RESTful API
- **Authentication**: Session-based
- **CORS**: Cross-Origin Resource Sharing
- **Error Handling**: Global Error Management

## 📦 설치 및 실행

### 1. 프로젝트 클론

```bash
git clone [repository-url]
cd eri_front
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080

# Custom Keys (Optional)
CUSTOM_KEY=your_custom_value

# Development Settings
NODE_ENV=development
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 애플리케이션을 확인하세요.

### 5. 프로덕션 빌드

```bash
npm run build
npm start
```

## 🏗️ 프로젝트 구조

```
src/
├── app/                          # Next.js App Router
│   ├── (page)/                   # 페이지 그룹
│   │   ├── admin/               # 관리자 페이지
│   │   ├── main/                # 메인 페이지
│   │   └── guide/               # 가이드 페이지
│   ├── login/                   # 로그인 페이지
│   ├── dashboard/               # 대시보드
│   ├── globals.css              # 전역 스타일
│   ├── layout.tsx               # 루트 레이아웃
│   └── page.tsx                 # 홈페이지
├── common/                      # 공통 모듈
│   ├── components/              # 공통 컴포넌트
│   │   ├── PageMove.js          # 페이지 이동 관리
│   │   └── ClientMount.js       # 클라이언트 마운트
│   ├── store/                   # 상태 관리
│   │   ├── pageMoveStore.js     # 페이지 이동 상태
│   │   └── menuStore.js         # 메뉴 상태
│   └── utils/                   # 유틸리티 함수
├── components/                  # UI 컴포넌트
│   ├── button/                  # 버튼 컴포넌트
│   ├── dialog/                  # 다이얼로그 컴포넌트
│   ├── layout/                  # 레이아웃 컴포넌트
│   ├── popup/                   # 팝업 컴포넌트
│   └── etc/                     # 기타 컴포넌트
├── lib/                         # 라이브러리
│   ├── api.ts                   # API 통신
│   └── utils.ts                 # 유틸리티 함수
└── types/                       # TypeScript 타입 정의
```

## 🎨 UI 컴포넌트 시스템

### 다이얼로그 시스템

프로젝트는 전역 유틸리티 객체를 통한 통합된 다이얼로그 시스템을 제공합니다.

#### 📋 다이얼로그 종류

- **Alert**: 정보 알림 (성공, 안내 메시지)
- **Confirm**: 사용자 확인 (삭제, 저장 등)
- **ErrorAlert**: 오류 표시 (API 오류, 예외 상황)
- **FullPopup**: 전체 화면 팝업 (상세 정보, 설정 등)
- **BottomSheet**: 하단 시트 (모바일 친화적 인터페이스)
- **Toast**: 토스트 알림 (간단한 메시지)

#### 🎯 주요 특징

- **전역 유틸리티**: `alert`, `bottomSheet`, `FullPopup`, `toast` 객체 사용
- **GSAP 애니메이션**: 부드러운 열기/닫기 애니메이션
- **접근성**: ARIA 라벨 및 포커스 관리
- **반응형**: 모바일/데스크톱 최적화
- **DOM 기반**: 직접 DOM 조작으로 빠른 성능

#### 💻 사용 예시

```jsx
import { alert, bottomSheet, FullPopup, toast } from "@/common/ui_com";

// 1. 알림 다이얼로그 (정보 표시)
alert.AlertOpen("저장되었습니다.", "데이터가 성공적으로 저장되었습니다.", {
  okCallback: () => {
    console.log("확인 버튼 클릭");
  },
  okLabel: "확인",
});

// 2. 확인 다이얼로그 (사용자 확인)
alert.ConfirmOpen(
  "정말 삭제하시겠습니까?",
  "삭제된 데이터는 복구할 수 없습니다.",
  {
    okCallback: () => {
      console.log("확인 - 삭제 실행");
      deleteItem(id);
    },
    cancelCallback: () => {
      console.log("취소 - 삭제 취소");
    },
    okLabel: "삭제",
    cancelLabel: "취소",
  }
);

// 3. 에러 다이얼로그 (오류 표시)
alert.ErrorAlert(
  "오류가 발생했습니다.",
  [
    {
      ERR_CTNT: "서버 연결에 실패했습니다.",
      INBN_ERR_DVCD: "API",
      INBN_ERR_CD: "001",
      SRVC_ID: "USER_SERVICE",
    },
  ],
  () => {
    console.log("에러 다이얼로그 닫힘");
  }
);

// 4. 전체 화면 팝업 (상세 정보)
FullPopup.Open("#myFullPopup");

// 5. 하단 시트 (모바일 친화적)
bottomSheet.Open("#myBottomSheet", "50%");

// 6. 토스트 알림 (간단한 메시지)
toast.callCommonToastOpen("저장되었습니다.", {
  duration: 3000,
});
```

#### ⚙️ 고급 설정

```jsx
// 커스텀 옵션이 있는 확인 다이얼로그
alert.ConfirmOpen("설정을 저장하시겠습니까?", "변경사항이 적용됩니다.", {
  okCallback: () => {
    saveSettings();
    alert.AlertOpen("저장 완료", "설정이 저장되었습니다.");
  },
  cancelCallback: () => {
    console.log("설정 저장 취소");
  },
  okLabel: "저장",
  cancelLabel: "취소",
  hideLeftTopButton: "Y", // 왼쪽 상단 닫기 버튼 숨김
});

// 비동기 작업과 함께 사용
const handleDelete = async () => {
  try {
    await deleteItem(id);
    alert.AlertOpen("삭제 완료", "항목이 삭제되었습니다.");
  } catch (error) {
    alert.ErrorAlert("삭제 실패", [
      {
        ERR_CTNT: error.message,
        INBN_ERR_DVCD: "DELETE",
        INBN_ERR_CD: "FAILED",
        SRVC_ID: "ITEM_SERVICE",
      },
    ]);
  }
};

// 팝업 상태 확인
if (alert.commonConfirmOpened()) {
  console.log("확인 다이얼로그가 열려있음");
}

// 팝업 강제 닫기
alert.commonConfirmClose();
```

### 버튼 컴포넌트

```jsx
import { CmpButton } from '@/components/button/cmp_button';

// 기본 버튼
<CmpButton onClick={handleClick}>클릭</CmpButton>

// 스타일 변형
<CmpButton variant="primary" size="lg">큰 버튼</CmpButton>
<CmpButton variant="secondary" disabled>비활성화</CmpButton>
```

## 🔄 상태 관리 (Zustand)

### 페이지 이동 상태

```jsx
import { usePageMoveStore } from "@/common/store/pageMoveStore";

const { setMoveTo, setRefresh, setGoBack } = usePageMoveStore();

// 페이지 이동
setMoveTo("/dashboard");

// 새로고침
setRefresh();

// 뒤로가기
setGoBack();
```

### 팝업 상태

```jsx
import { alert, bottomSheet, FullPopup, toast } from "@/common/ui_com";

// 팝업 열기/닫기
alert.Open("#popupId");
alert.Closed("#popupId");

// 팝업 상태 확인
alert.commonPopupOpened("#popupId");
alert.commonConfirmOpened();
alert.commonAlertOpened();

// 팝업 강제 닫기
alert.commonConfirmClose();
alert.commonAlertClose();
```

### 메뉴 상태

```jsx
import { useMenuStore } from "@/common/store/menuStore";

const { activeMenus, setActiveMenus } = useMenuStore();
```

## 🌐 API 통신

### API 설정

```typescript
// src/lib/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 10000,
});

// 요청 인터셉터
api.interceptors.request.use((config) => {
  // 요청 전 처리
  return config;
});

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 에러 처리
    return Promise.reject(error);
  }
);
```

### API 함수 예시

```typescript
// 인증 API
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  logout: () => api.post("/auth/logout"),
  sessionStatus: () => api.get("/auth/session-status"),
};

// 메뉴 API
export const menuAPI = {
  getMenuList: () => api.get("/menu/list"),
};
```

## 🎯 주요 페이지

### 1. 메인 페이지 (`/main`)

- 마음건강검진 소개
- 주요 서비스 안내
- 빠른 접근 링크

### 2. 대시보드 (`/dashboard`)

- 개인 건강 상태 요약
- 최근 활동 내역
- 추천 프로그램

### 3. 관리자 페이지 (`/admin`)

- 사용자 관리
- 프로그램 운영
- 통계 분석

### 4. 가이드 페이지 (`/guide`)

- 컴포넌트 사용법
- API 테스트
- 개발 가이드

## 🔧 개발 가이드

### 새 페이지 추가

1. `src/app/(page)/` 디렉토리에 새 폴더 생성
2. `page.js` 파일 생성
3. 레이아웃 및 스타일링 적용

```tsx
// src/app/(page)/new-page/page.tsx
"use client";

import { PageWrapper } from "@/components/layout";

export default function NewPage() {
  return (
    <PageWrapper title="새 페이지" subtitle="페이지 설명">
      {/* 페이지 내용 */}
    </PageWrapper>
  );
}
```

### 새 컴포넌트 추가

1. `src/components/` 디렉토리에 새 폴더 생성
2. 컴포넌트 파일 생성
3. TypeScript 인터페이스 정의

```tsx
// src/components/new-component/NewComponent.tsx
interface NewComponentProps {
  title: string;
  onClick?: () => void;
}

export function NewComponent({ title, onClick }: NewComponentProps) {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold">{title}</h2>
      {onClick && (
        <button
          onClick={onClick}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          클릭
        </button>
      )}
    </div>
  );
}
```

### 새 API 함수 추가

1. `src/lib/api.ts`에 새 API 함수 추가
2. 에러 처리 및 타입 정의

```typescript
// src/lib/api.ts
export const newAPI = {
  getData: () => api.get("/new-endpoint"),
  postData: (data) => api.post("/new-endpoint", data),
  updateData: (id, data) => api.put(`/new-endpoint/${id}`, data),
  deleteData: (id) => api.delete(`/new-endpoint/${id}`),
};
```

## 🚀 성능 최적화

### Next.js 설정 최적화

```javascript
// next.config.mjs
const nextConfig = {
  // 이미지 최적화
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },

  // 보안 헤더
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },

  // 압축 활성화
  compress: true,

  // React StrictMode 비활성화 (개발 시)
  reactStrictMode: false,
};
```

### 코드 분할 및 지연 로딩

Next.js의 동적 임포트를 활용하여 번들 크기를 최적화하고 초기 로딩 성능을 향상시킬 수 있습니다.

#### 🔧 기본 동적 임포트

```jsx
import dynamic from "next/dynamic";

// 기본 동적 임포트
const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <div>로딩 중...</div>,
  ssr: false,
});
```

#### 📱 모바일 전용 컴포넌트

```jsx
// 모바일에서만 필요한 컴포넌트를 지연 로딩
const MobileOnlyComponent = dynamic(() => import("./MobileComponent"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-20 rounded"></div>,
  ssr: false,
});

// 사용 예시
function ResponsivePage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div>
      <h1>반응형 페이지</h1>
      {isMobile && <MobileOnlyComponent />}
    </div>
  );
}
```

#### 🎨 UI 컴포넌트 지연 로딩

```jsx
// 복잡한 UI 컴포넌트들을 지연 로딩
const ChartComponent = dynamic(
  () => import("@/components/charts/ChartComponent"),
  {
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    ),
    ssr: false,
  }
);

const DataTable = dynamic(() => import("@/components/tables/DataTable"), {
  loading: () => (
    <div className="animate-pulse space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 rounded"></div>
      ))}
    </div>
  ),
  ssr: false,
});

// 사용 예시
function DashboardPage() {
  const [showChart, setShowChart] = useState(false);
  const [showTable, setShowTable] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <button
          onClick={() => setShowChart(!showChart)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {showChart ? "차트 숨기기" : "차트 보기"}
        </button>
        <button
          onClick={() => setShowTable(!showTable)}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          {showTable ? "테이블 숨기기" : "테이블 보기"}
        </button>
      </div>

      {showChart && <ChartComponent />}
      {showTable && <DataTable />}
    </div>
  );
}
```

#### 🔐 인증이 필요한 컴포넌트

```jsx
// 관리자 전용 컴포넌트를 지연 로딩
const AdminPanel = dynamic(() => import("@/components/admin/AdminPanel"), {
  loading: () => <div>관리자 패널 로딩 중...</div>,
  ssr: false,
});

// 사용 예시
function MainPage() {
  const [userRole, setUserRole] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    // 사용자 권한 확인
    checkUserRole().then((role) => setUserRole(role));
  }, []);

  return (
    <div>
      <h1>메인 페이지</h1>

      {userRole === "admin" && (
        <button
          onClick={() => setShowAdmin(!showAdmin)}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          {showAdmin ? "관리자 패널 숨기기" : "관리자 패널 보기"}
        </button>
      )}

      {showAdmin && userRole === "admin" && <AdminPanel />}
    </div>
  );
}
```

#### 📊 데이터 기반 지연 로딩

```jsx
// 데이터가 있을 때만 컴포넌트 로딩
const DataVisualization = dynamic(
  () => import("@/components/charts/DataVisualization"),
  {
    loading: () => <div>데이터 시각화 준비 중...</div>,
    ssr: false,
  }
);

// 사용 예시
function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData()
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((error) => {
        console.error("데이터 로딩 실패:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>데이터 로딩 중...</div>;
  }

  if (!data || data.length === 0) {
    return <div>표시할 데이터가 없습니다.</div>;
  }

  return (
    <div>
      <h1>분석 페이지</h1>
      <DataVisualization data={data} />
    </div>
  );
}
```

#### ⚙️ 고급 설정

```jsx
// 커스텀 로딩 컴포넌트
const CustomLoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="relative">
      <div className="w-12 h-12 border-4 border-blue-200 rounded-full"></div>
      <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
    </div>
    <span className="ml-3 text-gray-600">컴포넌트 로딩 중...</span>
  </div>
);

// 에러 처리와 함께 동적 임포트
const ErrorBoundaryComponent = dynamic(
  () => import("./ErrorBoundaryComponent"),
  {
    loading: CustomLoadingSpinner,
    ssr: false,
    onError: (error) => {
      console.error("컴포넌트 로딩 실패:", error);
      // 에러 처리 로직
    },
  }
);

// 조건부 동적 임포트
const ConditionalComponent = dynamic(
  () => {
    if (process.env.NODE_ENV === "development") {
      return import("./DevComponent");
    }
    return import("./ProdComponent");
  },
  {
    loading: () => <div>환경별 컴포넌트 로딩 중...</div>,
    ssr: false,
  }
);
```

#### 📈 성능 모니터링

```jsx
// 동적 임포트 성능 측정
const PerformanceComponent = dynamic(
  () => {
    const startTime = performance.now();

    return import("./PerformanceComponent").then((module) => {
      const endTime = performance.now();
      console.log(`컴포넌트 로딩 시간: ${endTime - startTime}ms`);
      return module;
    });
  },
  {
    loading: () => <div>성능 측정 중...</div>,
    ssr: false,
  }
);
```

## 🧪 테스트

### 단위 테스트

```bash
npm test
```

### E2E 테스트

```bash
npm run test:e2e
```

### 빌드 테스트

```bash
npm run build
npm start
```

## 📱 반응형 디자인

### 브레이크포인트

```css
/* Tailwind CSS 브레이크포인트 */
sm: 640px   /* 모바일 가로 */
md: 768px   /* 태블릿 */
lg: 1024px  /* 데스크톱 */
xl: 1280px  /* 큰 데스크톱 */
2xl: 1536px /* 초대형 화면 */
```

### 반응형 컴포넌트 예시

```tsx
function ResponsiveComponent() {
  return (
    <div
      className="
      grid
      grid-cols-1
      md:grid-cols-2
      lg:grid-cols-3
      gap-4
      p-4
    "
    >
      {/* 반응형 그리드 아이템들 */}
    </div>
  );
}
```

## 🔒 보안

### 인증 및 권한

- 세션 기반 인증
- 자동 세션 체크
- 권한 기반 접근 제어
- XSS 및 CSRF 방지

### 데이터 보호

- HTTPS 강제 사용
- 민감 정보 암호화
- 입력 데이터 검증
- 에러 메시지 보안

## 🚀 배포

### Vercel 배포 (권장)

1. Vercel 계정 생성
2. GitHub 저장소 연결
3. 환경 변수 설정
4. 자동 배포 활성화

### Docker 배포

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

### 환경별 설정

```bash
# 개발 환경
npm run dev

# 스테이징 환경
npm run build:staging
npm start

# 프로덕션 환경
npm run build:production
npm start
```




## 📞 지원

### 개발팀 연락처

- **이메일**: icejung@niccompany.co.kr

### 이슈 리포트

레드마인

---
