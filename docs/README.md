# CSS 관련 문서

## 📚 문서 목록

이 프로젝트의 CSS 개발을 위한 종합적인 가이드 문서들을 제공합니다.

### 📖 주요 문서

1. **[CSS 가이드 문서](./CSS_GUIDE.md)**

   - 프로젝트 CSS 아키텍처 개요
   - Tailwind CSS, PostCSS, Autoprefixer 사용법
   - 반응형 디자인 및 성능 최적화
   - 베스트 프랙티스 및 문제 해결

2. **[Tailwind CSS 설정 가이드](./TAILWIND_CONFIG.md)**

   - Tailwind CSS 설정 파일 구성
   - 테마 커스터마이징 (색상, 폰트, 간격)
   - 컴포넌트 및 유틸리티 확장
   - 플러그인 설정 및 성능 최적화

3. **[컴포넌트 스타일링 가이드](./COMPONENT_STYLING.md)**
   - UI 컴포넌트별 스타일링 패턴
   - 레이아웃, 폼, 네비게이션 컴포넌트
   - 반응형 패턴 및 애니메이션
   - 접근성 및 성능 최적화

---

## 🎯 빠른 시작

### 1. CSS 개발 환경 설정

```bash
# 필요한 패키지 설치 확인
npm install tailwindcss postcss autoprefixer

# Tailwind CSS 초기화
npx tailwindcss init -p
```

### 2. 기본 CSS 파일 설정

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 커스텀 컴포넌트 */
@layer components {
  .btn-primary {
    @apply bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700;
  }
}
```

### 3. 컴포넌트에서 사용

```jsx
// 기본 사용법
<button className="btn-primary">버튼</button>
<div className="bg-white rounded-lg shadow-md p-6">카드</div>
```

---

## 🛠️ 개발 도구

### VS Code 확장 프로그램

- **Tailwind CSS IntelliSense**: Tailwind 클래스 자동완성
- **PostCSS Language Support**: PostCSS 문법 지원
- **CSS Peek**: CSS 정의 빠른 확인

### 브라우저 개발자 도구

- **Tailwind CSS DevTools**: 브라우저에서 Tailwind 클래스 확인
- **CSS Grid Inspector**: CSS Grid 레이아웃 디버깅

---

## 📋 체크리스트

### 프로젝트 설정

- [ ] Tailwind CSS 설치 및 설정
- [ ] PostCSS 플러그인 구성
- [ ] 브라우저 호환성 설정
- [ ] CSS 압축 및 최적화

### 컴포넌트 개발

- [ ] 일관된 네이밍 규칙 적용
- [ ] 반응형 디자인 구현
- [ ] 접근성 고려
- [ ] 성능 최적화

### 코드 품질

- [ ] CSS 클린 코드 원칙 적용
- [ ] 컴포넌트 재사용성 확보
- [ ] 브라우저 호환성 테스트
- [ ] 성능 모니터링

---

## 🔗 유용한 링크

### 공식 문서

- [Tailwind CSS 공식 문서](https://tailwindcss.com/docs)
- [PostCSS 공식 문서](https://postcss.org/)
- [Next.js CSS 문서](https://nextjs.org/docs/basic-features/built-in-css-support)

### 도구 및 리소스

- [Tailwind CSS Play CDN](https://play.tailwindcss.com/)
- [CSS Grid Generator](https://cssgrid-generator.netlify.app/)
- [Flexbox Froggy](https://flexboxfroggy.com/)

### 디자인 시스템

- [Tailwind UI](https://tailwindui.com/)
- [Headless UI](https://headlessui.dev/)
- [Radix UI](https://www.radix-ui.com/)

---

## 🆘 문제 해결

### 자주 발생하는 문제

#### 1. Tailwind CSS 클래스가 적용되지 않음

```bash
# 해결 방법
npm run build
# 또는
npx tailwindcss -i ./src/app/globals.css -o ./dist/output.css --watch
```

#### 2. PostCSS 플러그인 오류

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

## 📞 지원

CSS 관련 질문이나 개선사항이 있으면:

1. **문서 검토**: 위의 가이드 문서들을 먼저 확인
2. **팀 문의**: 개발팀에 직접 문의
3. **이슈 등록**: GitHub 이슈로 등록

---

## 📝 문서 업데이트

이 문서들은 프로젝트의 발전에 따라 지속적으로 업데이트됩니다.

### 최근 업데이트

- **2024년**: 초기 문서 작성
- **Tailwind CSS v3.x**: 최신 버전 지원
- **Next.js 14**: App Router 지원

---

_이 문서들은 프로젝트의 CSS 개발 표준을 제공합니다. 모든 팀원이 이 가이드라인을 따라 일관된 코드를 작성할 수 있도록 도와줍니다._
