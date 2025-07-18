# CSS 가이드 문서

## 📋 목차

1. [개요](#개요)
2. [CSS 아키텍처](#css-아키텍처)
3. [Tailwind CSS](#tailwind-css)
4. [PostCSS 설정](#postcss-설정)
5. [Autoprefixer](#autoprefixer)
6. [컴포넌트별 스타일링](#컴포넌트별-스타일링)
7. [반응형 디자인](#반응형-디자인)
8. [성능 최적화](#성능-최적화)
9. [베스트 프랙티스](#베스트-프랙티스)

---

## 🎯 개요

이 프로젝트는 **Tailwind CSS**를 기반으로 하며, **PostCSS**와 **Autoprefixer**를 통해 모던한 CSS 개발 환경을 제공합니다.

### 🛠️ 사용 기술

- **Tailwind CSS**: 유틸리티 퍼스트 CSS 프레임워크
- **PostCSS**: CSS 처리 및 변환 도구
- **Autoprefixer**: 브라우저 호환성을 위한 벤더 프리픽스 자동 추가
- **CSS Custom Properties**: CSS 변수 시스템

---

## 🏗️ CSS 아키텍처

### 파일 구조

```
src/
├── app/
│   ├── globals.css          # 전역 CSS 스타일
│   └── layout.js            # 레이아웃 컴포넌트
├── components/
│   ├── ui/                  # UI 컴포넌트
│   ├── layout/              # 레이아웃 컴포넌트
│   └── charts/              # 차트 컴포넌트
└── styles/                  # 추가 스타일 파일들
```

### CSS 레이어 구조

```css
@tailwind base; /* 기본 스타일 리셋 */
@tailwind components; /* 컴포넌트 스타일 */
@tailwind utilities; /* 유틸리티 클래스 */
```

---

## 🎨 Tailwind CSS

### 기본 사용법

#### 1. 유틸리티 클래스

```jsx
// 기본 스타일링
<div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
  버튼
</div>

// 반응형 디자인
<div className="w-full md:w-1/2 lg:w-1/3 p-4">
  반응형 컨테이너
</div>

// 상태별 스타일
<button className="bg-blue-500 hover:bg-blue-700 active:bg-blue-900">
  인터랙티브 버튼
</button>
```

#### 2. 커스텀 컴포넌트

```css
/* globals.css */
@layer components {
  .btn-primary {
    @apply bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors;
  }

  .card {
    @apply bg-white rounded-lg shadow-md p-6 border border-gray-200;
  }
}
```

```jsx
// 사용법
<button className="btn-primary">Primary Button</button>
<div className="card">Card Content</div>
```

### 색상 시스템

```jsx
// 기본 색상
<div className="bg-blue-500 text-white">파란색 배경</div>
<div className="bg-green-500 text-white">초록색 배경</div>
<div className="bg-red-500 text-white">빨간색 배경</div>

// 투명도
<div className="bg-blue-500/50">50% 투명도</div>
<div className="bg-blue-500/75">75% 투명도</div>

// 그라데이션
<div className="bg-gradient-to-r from-blue-500 to-purple-500">
  그라데이션 배경
</div>
```

### 간격 시스템

```jsx
// 패딩
<div className="p-4">모든 방향 패딩</div>
<div className="px-4 py-2">가로/세로 패딩</div>
<div className="pt-4 pb-2 pl-3 pr-5">개별 방향 패딩</div>

// 마진
<div className="m-4">모든 방향 마진</div>
<div className="mx-auto">가운데 정렬</div>
<div className="mt-8 mb-4">상하 마진</div>
```

---

## ⚙️ PostCSS 설정

### 설정 파일

```javascript
// postcss.config.mjs
const config = {
  plugins: {
    tailwindcss: {}, // Tailwind CSS
    autoprefixer: {}, // 브라우저 호환성
    "postcss-nested": {}, // CSS 중첩
    "postcss-custom-properties": {}, // CSS 변수
  },
};
```

### 플러그인 설명

#### 1. **tailwindcss**

- Tailwind CSS 프레임워크 처리
- 유틸리티 클래스 생성

#### 2. **autoprefixer**

- 브라우저별 벤더 프리픽스 자동 추가
- CSS 호환성 보장

#### 3. **postcss-nested**

```css
/* 입력 */
.card {
  background: white;

  .title {
    font-size: 18px;

    &:hover {
      color: blue;
    }
  }
}

/* 출력 */
.card {
  background: white;
}
.card .title {
  font-size: 18px;
}
.card .title:hover {
  color: blue;
}
```

#### 4. **postcss-custom-properties**

```css
/* CSS 변수 사용 */
:root {
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
}

.button {
  background-color: var(--primary-color);
  color: var(--secondary-color);
}
```

---

## 🔧 Autoprefixer

### 브라우저 지원 설정

```json
// package.json
"browserslist": [
  "> 1%",           // 전 세계 사용률 1% 이상
  "last 2 versions", // 최신 2개 버전
  "not dead",       // 24개월 이상 업데이트 없음 제외
  "not ie 11"       // IE 11 제외
]
```

### 실제 변환 예시

```css
/* 입력 */
.container {
  display: flex;
  align-items: center;
  user-select: none;
}

/* 출력 */
.container {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
```

---

## 🧩 컴포넌트별 스타일링

### 1. UI 컴포넌트

```jsx
// src/components/ui/CmpInput.js
const CmpInput = ({ label, error, ...props }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-3 py-2 border rounded-md
          focus:outline-none focus:ring-2 focus:ring-blue-500
          ${error ? "border-red-500" : "border-gray-300"}
        `}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
```

### 2. 레이아웃 컴포넌트

```jsx
// src/components/layout/PageWrapper.js
const PageWrapper = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {title && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="mt-2 text-lg text-gray-600">{subtitle}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
```

### 3. 차트 컴포넌트

```jsx
// src/components/charts/EChartsWrapper.js
const EChartsWrapper = ({ option, style, className }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm border ${className}`}
      style={style}
    >
      <ReactECharts option={option} />
    </div>
  );
};
```

---

## 📱 반응형 디자인

### 브레이크포인트

```jsx
// Tailwind CSS 기본 브레이크포인트
<div
  className="
  w-full          // 모바일: 전체 너비
  sm:w-1/2        // 640px+: 절반 너비
  md:w-1/3        // 768px+: 1/3 너비
  lg:w-1/4        // 1024px+: 1/4 너비
  xl:w-1/5        // 1280px+: 1/5 너비
"
>
  반응형 컨테이너
</div>
```

### 그리드 시스템

```jsx
// Flexbox 그리드
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div className="card">아이템 1</div>
  <div className="card">아이템 2</div>
  <div className="card">아이템 3</div>
</div>

// CSS Grid
<div className="grid grid-cols-12 gap-4">
  <div className="col-span-12 md:col-span-8">메인 콘텐츠</div>
  <div className="col-span-12 md:col-span-4">사이드바</div>
</div>
```

### 모바일 퍼스트 접근법

```jsx
// 기본: 모바일 스타일
// sm:, md:, lg:, xl:: 데스크톱 스타일
<div
  className="
  text-sm          // 모바일: 작은 텍스트
  md:text-base     // 태블릿+: 기본 텍스트
  lg:text-lg       // 데스크톱+: 큰 텍스트
  p-2              // 모바일: 작은 패딩
  md:p-4           // 태블릿+: 기본 패딩
  lg:p-6           // 데스크톱+: 큰 패딩
"
>
  반응형 텍스트
</div>
```

---

## ⚡ 성능 최적화

### 1. CSS 번들 최적화

```javascript
// next.config.mjs
const nextConfig = {
  // CSS 압축
  compress: true,

  // 이미지 최적화
  images: {
    formats: ["image/webp", "image/avif"],
  },
};
```

### 2. 사용하지 않는 CSS 제거

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  // 사용하지 않는 스타일 자동 제거
};
```

### 3. CSS 변수 활용

```css
/* globals.css */
:root {
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
  --text-color: #2c3e50;
  --background-color: #ecf0f1;
}

/* 컴포넌트에서 사용 */
.button {
  background-color: var(--primary-color);
  color: white;
}
```

---

## 🎯 베스트 프랙티스

### 1. 클래스 네이밍

```jsx
// ✅ 좋은 예
<div className="user-profile-card">
<div className="btn-primary">
<div className="form-input-error">

// ❌ 나쁜 예
<div className="card">
<div className="button">
<div className="input">
```

### 2. 컴포넌트 스타일링

```jsx
// ✅ 컴포넌트별 스타일 분리
const UserCard = ({ user }) => {
  return (
    <div className="user-card">
      <img className="user-card__avatar" src={user.avatar} />
      <div className="user-card__content">
        <h3 className="user-card__name">{user.name}</h3>
        <p className="user-card__email">{user.email}</p>
      </div>
    </div>
  );
};
```

### 3. 조건부 스타일링

```jsx
// ✅ 조건부 클래스
const Button = ({ variant, size, disabled, children }) => {
  const baseClasses = "font-medium rounded-lg transition-colors";

  const variantClasses = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-500 text-white hover:bg-gray-600",
    outline: "border border-blue-500 text-blue-500 hover:bg-blue-50",
  };

  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const classes = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
  `;

  return (
    <button className={classes} disabled={disabled}>
      {children}
    </button>
  );
};
```

### 4. 접근성 고려

```jsx
// ✅ 접근성을 고려한 스타일링
<button
  className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  aria-label="메뉴 열기"
>
  메뉴
</button>

<div className="sr-only">스크린 리더 전용 텍스트</div>
```

### 5. 다크 모드 지원

```css
/* 다크 모드 스타일 */
@media (prefers-color-scheme: dark) {
  :root {
    --background-color: #1a1a1a;
    --text-color: #ffffff;
    --border-color: #333333;
  }
}

/* Tailwind CSS 다크 모드 */
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  다크 모드 지원
</div>
```

---

## 🔧 유용한 도구들

### 1. CSS 디버깅

```css
/* 개발 시 유용한 디버깅 클래스 */
.debug {
  outline: 1px solid red;
}

.debug-grid {
  background-image: linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}
```

### 2. 유틸리티 클래스

```css
/* globals.css */
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }

  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

### 3. 애니메이션

```css
/* 커스텀 애니메이션 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.5s ease-out;
}
```

---

## 📚 참고 자료

- [Tailwind CSS 공식 문서](https://tailwindcss.com/docs)
- [PostCSS 공식 문서](https://postcss.org/)
- [Autoprefixer 문서](https://autoprefixer.github.io/)
- [CSS Grid 가이드](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Flexbox 가이드](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

---

## 🆘 문제 해결

### 자주 발생하는 문제들

#### 1. Tailwind CSS 클래스가 적용되지 않음

```bash
# 해결 방법
npm run build
# 또는
npx tailwindcss -i ./src/app/globals.css -o ./dist/output.css --watch
```

#### 2. PostCSS 플러그인이 작동하지 않음

```javascript
// postcss.config.mjs 확인
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

#### 3. 브라우저 호환성 문제

```json
// package.json의 browserslist 확인
"browserslist": [
  "> 1%",
  "last 2 versions",
  "not dead"
]
```

---

_이 문서는 프로젝트의 CSS 개발 가이드라인을 제공합니다. 추가 질문이나 개선사항이 있으면 팀에 문의해주세요._
