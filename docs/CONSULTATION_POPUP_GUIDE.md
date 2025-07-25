# 상담신청 공통 팝업 가이드

## 📋 개요

상담신청 공통 팝업은 어떤 페이지에서든 상담을 신청할 수 있도록 제공되는 전역 팝업 컴포넌트입니다. 사용자가 어디서든 쉽게 상담을 신청할 수 있어 사용성을 크게 향상시킵니다.

## 🚀 주요 기능

- **전역 접근**: 어떤 페이지에서든 상담신청 가능
- **일관된 UI**: 모든 페이지에서 동일한 상담신청 폼 제공
- **성공 콜백**: 상담신청 완료 후 페이지별 커스텀 동작 실행
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원
- **파일 첨부**: 다중 파일 업로드 지원
- **익명 작성**: 익명으로 상담 신청 가능

## 📁 파일 구조

```
src/
├── components/
│   ├── ConsultationPopup.js          # 상담신청 팝업 컴포넌트
│   ├── ConsultationPopupProvider.js  # 팝업 Provider 컴포넌트
│   └── ConsultationButton.js         # 상담신청 버튼 컴포넌트
├── common/
│   └── store/
│       └── consultationPopupStore.js # 팝업 상태 관리
└── app/
    └── layout.js                     # 전역 레이아웃 (Provider 포함)
```

## 🛠️ 사용법

### 1. 기본 사용법

#### ConsultationButton 컴포넌트 사용 (권장)

```jsx
import ConsultationButton from "@/components/ConsultationButton";

function MyPage() {
  return (
    <div>
      <h1>내 페이지</h1>

      {/* 기본 상담신청 버튼 */}
      <ConsultationButton>상담 신청</ConsultationButton>

      {/* 커스텀 스타일 */}
      <ConsultationButton
        variant="success"
        size="lg"
        className="bg-green-600 hover:bg-green-700"
      >
        💬 상담 신청하기
      </ConsultationButton>
    </div>
  );
}
```

#### 직접 Store 사용

```jsx
import { useConsultationPopupStore } from "@/common/store/consultationPopupStore";

function MyPage() {
  const { openPopup } = useConsultationPopupStore();

  const handleConsultationClick = () => {
    openPopup();
  };

  return <button onClick={handleConsultationClick}>상담 신청</button>;
}
```

### 2. 성공 콜백 사용

상담신청이 완료된 후 특정 동작을 실행하고 싶을 때 사용합니다.

```jsx
import ConsultationButton from "@/components/ConsultationButton";

function ConsultationPage() {
  const [consultationList, setConsultationList] = useState([]);

  // 상담신청 성공 시 목록 새로고침
  const handleConsultationSuccess = () => {
    fetchConsultationList();
  };

  return (
    <div>
      <ConsultationButton
        onSuccess={handleConsultationSuccess}
        variant="success"
      >
        상담 신청
      </ConsultationButton>
    </div>
  );
}
```

### 3. Store 직접 사용 (고급)

```jsx
import { useConsultationPopupStore } from "@/common/store/consultationPopupStore";

function MyPage() {
  const { openPopup } = useConsultationPopupStore();

  const handleConsultationWithCallback = () => {
    openPopup(() => {
      // 상담신청 완료 후 실행할 코드
      console.log("상담신청이 완료되었습니다!");
      // 페이지 새로고침, 알림 표시 등
    });
  };

  return <button onClick={handleConsultationWithCallback}>상담 신청</button>;
}
```

## 🎨 스타일링 옵션

### ConsultationButton Props

| Prop        | Type      | Default     | Description                                                                                  |
| ----------- | --------- | ----------- | -------------------------------------------------------------------------------------------- |
| `children`  | ReactNode | "상담 신청" | 버튼 텍스트                                                                                  |
| `variant`   | string    | "primary"   | 버튼 스타일 (primary, secondary, success, danger, warning, info, outline, text, ghost, link) |
| `size`      | string    | "md"        | 버튼 크기 (xs, sm, md, lg, xl)                                                               |
| `className` | string    | ""          | 추가 CSS 클래스                                                                              |
| `onSuccess` | function  | null        | 성공 시 호출할 콜백 함수                                                                     |
| `...props`  | -         | -           | 기타 CmpButton props                                                                         |

### 사용 예시

```jsx
// 다양한 스타일 예시
<ConsultationButton variant="primary" size="lg">
  상담 신청
</ConsultationButton>

<ConsultationButton variant="success" size="md">
  💬 상담 신청하기
</ConsultationButton>

<ConsultationButton
  variant="outline"
  size="sm"
  className="border-blue-500 text-blue-600"
>
  상담 문의
</ConsultationButton>
```

## 📱 반응형 디자인

상담신청 팝업은 모든 디바이스에서 최적화되어 있습니다:

- **데스크톱**: 최대 너비 2xl, 세로 스크롤 지원
- **태블릿**: 적응형 그리드 레이아웃
- **모바일**: 전체 화면 모달, 터치 친화적 UI

## 🔧 커스터마이징

### 팝업 내용 수정

`ConsultationPopup.js` 파일을 수정하여 팝업 내용을 커스터마이징할 수 있습니다:

```jsx
// ConsultationPopup.js 수정 예시
const ConsultationPopup = ({ isOpen, onClose, onSuccess }) => {
  // 폼 필드 추가/수정
  const [formData, setFormData] = useState({
    ttl: "",
    cntn: "",
    categoryCd: "",
    anonymousYn: "N",
    priorityCd: "PRI001",
    urgentYn: "N",
    // 새로운 필드 추가
    contactMethod: "email",
    preferredTime: "",
  });

  // 커스텀 유효성 검사
  const validateForm = () => {
    // 커스텀 검증 로직
  };

  // 커스텀 제출 로직
  const handleSubmit = async () => {
    // 커스텀 제출 로직
  };
};
```

### 스타일 커스터마이징

```css
/* globals.css에 추가 */
.consultation-popup {
  /* 커스텀 스타일 */
}

.consultation-popup .modal-content {
  /* 모달 내용 스타일 */
}
```

## 🚨 주의사항

1. **Provider 필수**: `ConsultationPopupProvider`가 `layout.js`에 포함되어야 합니다.
2. **API 의존성**: `consultationAPI`와 `commonCodeAPI`가 정상 작동해야 합니다.
3. **로그인 상태**: 상담신청은 로그인된 사용자만 가능합니다.
4. **파일 크기**: 첨부파일 크기 제한을 확인하세요.

## 🔍 디버깅

### 일반적인 문제 해결

1. **팝업이 열리지 않는 경우**

   - `ConsultationPopupProvider`가 `layout.js`에 포함되어 있는지 확인
   - 브라우저 콘솔에서 오류 메시지 확인

2. **API 호출 실패**

   - 네트워크 탭에서 API 요청/응답 확인
   - 백엔드 서버 상태 확인

3. **스타일 문제**
   - CSS 클래스가 올바르게 적용되었는지 확인
   - Tailwind CSS 클래스명 확인

### 로그 확인

```jsx
// 개발 시 로그 추가
const handleConsultationSuccess = () => {
  console.log("상담신청 성공!");
  // 추가 로직
};
```

## 📚 추가 리소스

- [Zustand 공식 문서](https://zustand-demo.pmnd.rs/)
- [React Hook Form](https://react-hook-form.com/) (폼 관리)
- [Tailwind CSS](https://tailwindcss.com/) (스타일링)

## 🤝 기여하기

상담신청 팝업을 개선하고 싶다면:

1. 이슈 등록
2. 기능 제안
3. 코드 리뷰 참여
4. 문서 개선

---

**마지막 업데이트**: 2024년 12월
