# Tailwind CSS 설정 가이드

## 📋 목차

1. [기본 설정](#기본-설정)
2. [테마 커스터마이징](#테마-커스터마이징)
3. [컴포넌트 확장](#컴포넌트-확장)
4. [유틸리티 확장](#유틸리티-확장)
5. [플러그인 설정](#플러그인-설정)
6. [성능 최적화](#성능-최적화)

---

## ⚙️ 기본 설정

### 현재 설정 파일

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
```

### 설정 설명

- **content**: Tailwind가 스캔할 파일 경로
- **theme.extend**: 기본 테마를 확장하는 설정
- **plugins**: 추가 플러그인 목록

---

## 🎨 테마 커스터마이징

### 색상 시스템 확장

```typescript
// tailwind.config.ts
const config: Config = {
  theme: {
    extend: {
      colors: {
        // 브랜드 색상
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          600: "#2563eb",
          900: "#1e3a8a",
        },
        secondary: {
          50: "#f0fdf4",
          100: "#dcfce7",
          500: "#22c55e",
          600: "#16a34a",
          900: "#14532d",
        },
        // 커스텀 색상
        "brand-blue": "#1e40af",
        "brand-green": "#059669",
      },
    },
  },
};
```

### 폰트 시스템 확장

```typescript
theme: {
  extend: {
    fontFamily: {
      'sans': ['Inter', 'system-ui', 'sans-serif'],
      'mono': ['JetBrains Mono', 'monospace'],
      'display': ['Poppins', 'sans-serif'],
    },
    fontSize: {
      'xs': ['0.75rem', { lineHeight: '1rem' }],
      'sm': ['0.875rem', { lineHeight: '1.25rem' }],
      'base': ['1rem', { lineHeight: '1.5rem' }],
      'lg': ['1.125rem', { lineHeight: '1.75rem' }],
      'xl': ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    },
  },
},
```

### 간격 시스템 확장

```typescript
theme: {
  extend: {
    spacing: {
      '18': '4.5rem',
      '88': '22rem',
      '128': '32rem',
    },
    maxWidth: {
      '8xl': '88rem',
      '9xl': '96rem',
    },
    minHeight: {
      'screen-75': '75vh',
    },
  },
},
```

### 브레이크포인트 확장

```typescript
theme: {
  extend: {
    screens: {
      'xs': '475px',
      '3xl': '1600px',
      '4xl': '1920px',
    },
  },
},
```

---

## 🧩 컴포넌트 확장

### 기본 컴포넌트 클래스

```css
/* globals.css */
@layer components {
  /* 버튼 컴포넌트 */
  .btn {
    @apply inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors;
  }

  .btn-primary {
    @apply btn bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500;
  }

  .btn-secondary {
    @apply btn bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500;
  }

  .btn-outline {
    @apply btn border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-primary-500;
  }

  /* 카드 컴포넌트 */
  .card {
    @apply bg-white overflow-hidden shadow-sm border border-gray-200 rounded-lg;
  }

  .card-header {
    @apply px-6 py-4 border-b border-gray-200 bg-gray-50;
  }

  .card-body {
    @apply px-6 py-4;
  }

  .card-footer {
    @apply px-6 py-4 border-t border-gray-200 bg-gray-50;
  }

  /* 폼 컴포넌트 */
  .form-input {
    @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500;
  }

  .form-label {
    @apply block text-sm font-medium text-gray-700 mb-1;
  }

  .form-error {
    @apply mt-1 text-sm text-red-600;
  }
}
```

### 사용법

```jsx
// 버튼 사용
<button className="btn-primary">Primary Button</button>
<button className="btn-secondary">Secondary Button</button>
<button className="btn-outline">Outline Button</button>

// 카드 사용
<div className="card">
  <div className="card-header">
    <h3 className="text-lg font-medium">Card Title</h3>
  </div>
  <div className="card-body">
    <p>Card content goes here...</p>
  </div>
  <div className="card-footer">
    <button className="btn-primary">Action</button>
  </div>
</div>

// 폼 사용
<div>
  <label className="form-label">Email</label>
  <input type="email" className="form-input" placeholder="Enter your email" />
  <p className="form-error">Please enter a valid email address.</p>
</div>
```

---

## 🛠️ 유틸리티 확장

### 커스텀 유틸리티 클래스

```css
/* globals.css */
@layer utilities {
  /* 텍스트 유틸리티 */
  .text-balance {
    text-wrap: balance;
  }

  .text-pretty {
    text-wrap: pretty;
  }

  /* 스크롤바 유틸리티 */
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }

  /* 애니메이션 유틸리티 */
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out;
  }

  .animate-slide-up {
    animation: slideUp 0.3s ease-out;
  }

  /* 그라데이션 유틸리티 */
  .bg-gradient-brand {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .bg-gradient-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  /* 그림자 유틸리티 */
  .shadow-soft {
    box-shadow: 0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04);
  }

  .shadow-medium {
    box-shadow: 0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
}
```

### 애니메이션 정의

```css
/* globals.css */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## 🔌 플러그인 설정

### 유용한 Tailwind 플러그인들

#### 1. **@tailwindcss/forms**

```bash
npm install @tailwindcss/forms
```

```typescript
// tailwind.config.ts
import forms from "@tailwindcss/forms";

const config: Config = {
  plugins: [forms],
};
```

#### 2. **@tailwindcss/typography**

```bash
npm install @tailwindcss/typography
```

```typescript
// tailwind.config.ts
import typography from "@tailwindcss/typography";

const config: Config = {
  plugins: [typography],
};
```

#### 3. **@tailwindcss/aspect-ratio**

```bash
npm install @tailwindcss/aspect-ratio
```

```typescript
// tailwind.config.ts
import aspectRatio from "@tailwindcss/aspect-ratio";

const config: Config = {
  plugins: [aspectRatio],
};
```

### 커스텀 플러그인

```typescript
// tailwind.config.ts
const config: Config = {
  plugins: [
    // 커스텀 플러그인
    function ({ addUtilities, theme }) {
      const newUtilities = {
        ".text-shadow": {
          textShadow: "0 2px 4px rgba(0,0,0,0.1)",
        },
        ".text-shadow-lg": {
          textShadow: "0 4px 8px rgba(0,0,0,0.12)",
        },
        ".text-shadow-none": {
          textShadow: "none",
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
```

---

## ⚡ 성능 최적화

### 1. Purge CSS 설정

```typescript
// tailwind.config.ts
const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // 사용하지 않는 스타일 자동 제거
};
```

### 2. JIT 모드 (Just-In-Time)

```typescript
// tailwind.config.ts
const config: Config = {
  mode: "jit", // Tailwind CSS v3.0+ 에서는 기본값
};
```

### 3. CSS 압축

```javascript
// next.config.mjs
const nextConfig = {
  compress: true,
  // CSS 압축 활성화
};
```

---

## 🎯 베스트 프랙티스

### 1. 컴포넌트 우선 접근법

```jsx
// ✅ 좋은 예: 컴포넌트 클래스 사용
<button className="btn-primary">Submit</button>
<div className="card">Content</div>

// ❌ 나쁜 예: 긴 유틸리티 클래스 체인
<button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
  Submit
</button>
```

### 2. 일관된 네이밍

```css
/* 컴포넌트 클래스 네이밍 규칙 */
.btn-{variant}          /* 버튼 변형 */
.card-{part}            /* 카드 부분 */
.form-{element}         /* 폼 요소 */
.text-{style}           /* 텍스트 스타일 */
.bg-{type}              /* 배경 타입 */
```

### 3. 반응형 디자인

```jsx
// 모바일 퍼스트 접근법
<div
  className="
  w-full          /* 모바일: 전체 너비 */
  md:w-1/2        /* 태블릿+: 절반 너비 */
  lg:w-1/3        /* 데스크톱+: 1/3 너비 */
  p-4             /* 모바일: 기본 패딩 */
  md:p-6          /* 태블릿+: 큰 패딩 */
  lg:p-8          /* 데스크톱+: 더 큰 패딩 */
"
>
  반응형 컨테이너
</div>
```

### 4. 다크 모드 지원

```typescript
// tailwind.config.ts
const config: Config = {
  darkMode: "class", // 또는 'media'
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#1a1a1a",
          text: "#ffffff",
          border: "#333333",
        },
      },
    },
  },
};
```

```jsx
// 다크 모드 클래스 사용
<div className="bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text">
  다크 모드 지원 컨텐츠
</div>
```

---

## 🔧 개발 도구

### 1. Tailwind CSS IntelliSense

VS Code 확장 프로그램 설치:

- Tailwind CSS IntelliSense
- PostCSS Language Support

### 2. 브라우저 개발자 도구

```css
/* 개발 시 유용한 디버깅 클래스 */
.debug {
  outline: 1px solid red !important;
}

.debug-grid {
  background-image: linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}
```

### 3. Tailwind CSS Play CDN

개발 중 빠른 테스트용:

```html
<script src="https://cdn.tailwindcss.com"></script>
```

---

## 📚 참고 자료

- [Tailwind CSS 공식 문서](https://tailwindcss.com/docs)
- [Tailwind CSS 설정 가이드](https://tailwindcss.com/docs/configuration)
- [Tailwind CSS 컴포넌트](https://tailwindui.com/)
- [Tailwind CSS 플러그인](https://github.com/aniftyco/awesome-tailwindcss)

---

_이 문서는 프로젝트의 Tailwind CSS 설정 및 사용법을 제공합니다. 추가 질문이나 개선사항이 있으면 팀에 문의해주세요._
