# 컴포넌트 스타일링 가이드

## 📋 목차
1. [개요](#개요)
2. [UI 컴포넌트](#ui-컴포넌트)
3. [레이아웃 컴포넌트](#레이아웃-컴포넌트)
4. [폼 컴포넌트](#폼-컴포넌트)
5. [네비게이션 컴포넌트](#네비게이션-컴포넌트)
6. [모달 컴포넌트](#모달-컴포넌트)
7. [차트 컴포넌트](#차트-컴포넌트)
8. [반응형 패턴](#반응형-패턴)
9. [애니메이션](#애니메이션)

---

## 🎯 개요

이 문서는 프로젝트의 컴포넌트별 스타일링 패턴과 베스트 프랙티스를 제공합니다.

### 🎨 디자인 시스템 원칙
- **일관성**: 모든 컴포넌트에서 동일한 디자인 언어 사용
- **재사용성**: 컴포넌트를 다양한 상황에서 재사용 가능
- **접근성**: 모든 사용자가 사용할 수 있도록 설계
- **성능**: 최적화된 CSS로 빠른 렌더링

---

## 🧩 UI 컴포넌트

### 1. 버튼 컴포넌트

#### 기본 버튼 스타일
```jsx
// src/components/ui/CmpButton.js
const CmpButton = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 active:bg-blue-800",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 active:bg-gray-800",
    outline: "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 active:bg-red-800",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg",
  };

  const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
  `;

  return (
    <button className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
};
```

#### 사용 예시
```jsx
// 기본 사용
<CmpButton>기본 버튼</CmpButton>
<CmpButton variant="secondary">보조 버튼</CmpButton>
<CmpButton variant="outline">아웃라인 버튼</CmpButton>

// 크기별 사용
<CmpButton size="sm">작은 버튼</CmpButton>
<CmpButton size="lg">큰 버튼</CmpButton>

// 상태별 사용
<CmpButton disabled>비활성화 버튼</CmpButton>
<CmpButton variant="danger">위험 버튼</CmpButton>
```

### 2. 카드 컴포넌트

#### 기본 카드 스타일
```jsx
// src/components/ui/CmpCard.js
const CmpCard = ({
  children,
  header,
  footer,
  padding = 'md',
  shadow = 'md',
  className = ''
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  const classes = `
    bg-white rounded-lg border border-gray-200 overflow-hidden
    ${shadowClasses[shadow]}
    ${className}
  `;

  return (
    <div className={classes}>
      {header && (
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          {header}
        </div>
      )}
      <div className={paddingClasses[padding]}>
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          {footer}
        </div>
      )}
    </div>
  );
};
```

#### 사용 예시
```jsx
// 기본 카드
<CmpCard>
  <h3 className="text-lg font-semibold mb-2">카드 제목</h3>
  <p className="text-gray-600">카드 내용입니다.</p>
</CmpCard>

// 헤더와 푸터가 있는 카드
<CmpCard
  header={<h3 className="text-lg font-semibold">제목</h3>}
  footer={<CmpButton>액션</CmpButton>}
>
  카드 내용
</CmpCard>

// 다양한 스타일
<CmpCard padding="lg" shadow="xl" className="hover:shadow-2xl transition-shadow">
  호버 효과가 있는 카드
</CmpCard>
```

### 3. 배지 컴포넌트

#### 배지 스타일
```jsx
// src/components/ui/CmpBadge.js
const CmpBadge = ({
  variant = 'default',
  size = 'md',
  children,
  className = ''
}) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-cyan-100 text-cyan-800",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-sm",
    lg: "px-3 py-1 text-sm",
  };

  const classes = `
    inline-flex items-center font-medium rounded-full
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `;

  return <span className={classes}>{children}</span>;
};
```

---

## 🏗️ 레이아웃 컴포넌트

### 1. 페이지 래퍼

#### 페이지 레이아웃
```jsx
// src/components/layout/PageWrapper.js
const PageWrapper = ({
  children,
  title,
  subtitle,
  breadcrumbs,
  actions,
  maxWidth = '7xl',
  className = ''
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <div className={`${maxWidthClasses[maxWidth]} mx-auto px-4 sm:px-6 lg:px-8 py-8`}>
        {/* 브레드크럼 */}
        {breadcrumbs && (
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              {breadcrumbs}
            </ol>
          </nav>
        )}

        {/* 헤더 */}
        {(title || actions) && (
          <div className="mb-8 flex items-center justify-between">
            <div>
              {title && (
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              )}
              {subtitle && (
                <p className="mt-2 text-lg text-gray-600">{subtitle}</p>
              )}
            </div>
            {actions && (
              <div className="flex items-center space-x-3">
                {actions}
              </div>
            )}
          </div>
        )}

        {/* 콘텐츠 */}
        {children}
      </div>
    </div>
  );
};
```

### 2. 그리드 레이아웃

#### 반응형 그리드
```jsx
// src/components/layout/Grid.js
const Grid = ({
  children,
  cols = 1,
  gap = 6,
  className = ''
}) => {
  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  };

  const gapClasses = {
    2: 'gap-2',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8',
  };

  const classes = `
    grid ${colsClasses[cols]} ${gapClasses[gap]}
    ${className}
  `;

  return <div className={classes}>{children}</div>;
};
```

---

## 📝 폼 컴포넌트

### 1. 입력 필드

#### 기본 입력 컴포넌트
```jsx
// src/components/ui/CmpInput.js
const CmpInput = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  size = 'md',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  const inputClasses = `
    block w-full border rounded-md shadow-sm
    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0
    transition-colors duration-200
    ${sizeClasses[size]}
    ${error
      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
    }
    ${leftIcon ? 'pl-10' : ''}
    ${rightIcon ? 'pr-10' : ''}
  `;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">{leftIcon}</span>
          </div>
        )}
        <input className={inputClasses} {...props} />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-400">{rightIcon}</span>
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};
```

### 2. 셀렉트 컴포넌트

#### 드롭다운 셀렉트
```jsx
// src/components/ui/CmpSelect.js
const CmpSelect = ({
  label,
  error,
  options = [],
  placeholder = "선택하세요",
  size = 'md',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  const selectClasses = `
    block w-full border rounded-md shadow-sm
    focus:outline-none focus:ring-2 focus:ring-offset-0
    transition-colors duration-200
    ${sizeClasses[size]}
    ${error
      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
    }
  `;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select className={selectClasses} {...props}>
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
```

---

## 🧭 네비게이션 컴포넌트

### 1. 탭 컴포넌트

#### 탭 네비게이션
```jsx
// src/components/ui/CmpTab.js
const CmpTab = ({
  tabs = [],
  activeTab,
  onTabChange,
  variant = 'default',
  size = 'md',
  className = ''
}) => {
  const variants = {
    default: {
      tab: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
      active: "border-blue-500 text-blue-600",
    },
    pills: {
      tab: "rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100",
      active: "bg-blue-100 text-blue-700",
    },
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <div className={`border-b border-gray-200 ${className}`}>
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              whitespace-nowrap border-b-2 font-medium transition-colors duration-200
              ${sizes[size]}
              ${activeTab === tab.id
                ? variants[variant].active
                : variants[variant].tab
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};
```

### 2. 사이드바 네비게이션

#### 사이드바 메뉴
```jsx
// src/components/layout/Sidebar.js
const Sidebar = ({
  items = [],
  activeItem,
  onItemClick,
  collapsed = false,
  className = ''
}) => {
  return (
    <div className={`bg-white border-r border-gray-200 ${className}`}>
      <nav className="space-y-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemClick(item.id)}
            className={`
              group flex items-center px-3 py-2 text-sm font-medium rounded-md
              transition-colors duration-200 w-full text-left
              ${activeItem === item.id
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }
            `}
          >
            {item.icon && (
              <span className={`
                mr-3 flex-shrink-0 h-6 w-6
                ${activeItem === item.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}
              `}>
                {item.icon}
              </span>
            )}
            {!collapsed && item.label}
          </button>
        ))}
      </nav>
    </div>
  );
};
```

---

## 🪟 모달 컴포넌트

### 1. 기본 모달

#### 모달 컴포넌트
```jsx
// src/components/ui/CmpModal.js
const CmpModal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* 배경 오버레이 */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* 모달 컨테이너 */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={`
          relative bg-white rounded-lg shadow-xl w-full
          ${sizeClasses[size]}
          ${className}
        `}>
          {/* 헤더 */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              {title && (
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <span className="sr-only">닫기</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* 콘텐츠 */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
```

---

## 📊 차트 컴포넌트

### 1. 차트 래퍼

#### 차트 컨테이너
```jsx
// src/components/charts/EChartsWrapper.js
const EChartsWrapper = ({
  option,
  style,
  className = '',
  loading = false,
  height = '400px',
  theme = 'default'
}) => {
  return (
    <div
      className={`
        bg-white rounded-lg shadow-sm border border-gray-200
        relative overflow-hidden
        ${className}
      `}
      style={{ height, ...style }}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
      <ReactECharts
        option={option}
        theme={theme}
        style={{ height: '100%' }}
      />
    </div>
  );
};
```

---

## 📱 반응형 패턴

### 1. 반응형 그리드

#### 카드 그리드
```jsx
const ResponsiveGrid = ({ children, className = '' }) => {
  return (
    <div className={`
      grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
      gap-4 sm:gap-6 lg:gap-8
      ${className}
    `}>
      {children}
    </div>
  );
};
```

### 2. 반응형 네비게이션

#### 모바일 친화적 네비게이션
```jsx
const ResponsiveNav = ({ items = [], activeItem, onItemClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* 데스크톱 메뉴 */}
          <div className="hidden md:flex space-x-8">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => onItemClick(item.id)}
                className={`
                  inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium
                  ${activeItem === item.id
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }
                `}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* 모바일 메뉴 버튼 */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onItemClick(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`
                  block w-full text-left px-3 py-2 rounded-md text-base font-medium
                  ${activeItem === item.id
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }
                `}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
```

---

## 🎬 애니메이션

### 1. 페이드 인 애니메이션

#### 기본 페이드 인
```css
/* globals.css */
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

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

.animate-fade-in-delay-1 {
  animation: fadeIn 0.5s ease-out 0.1s both;
}

.animate-fade-in-delay-2 {
  animation: fadeIn 0.5s ease-out 0.2s both;
}
```

### 2. 슬라이드 애니메이션

#### 슬라이드 효과
```css
@keyframes slideInFromLeft {
  from {
    opacity: 0;
    transform: translateX(-100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInFromRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-in-left {
  animation: slideInFromLeft 0.3s ease-out;
}

.animate-slide-in-right {
  animation: slideInFromRight 0.3s ease-out;
}
```

### 3. 스케일 애니메이션

#### 확대/축소 효과
```css
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scaleIn 0.2s ease-out;
}
```

### 4. 애니메이션 컴포넌트

#### 애니메이션 래퍼
```jsx
const AnimatedWrapper = ({
  children,
  animation = 'fadeIn',
  delay = 0,
  duration = 0.5,
  className = ''
}) => {
  const animationClasses = {
    fadeIn: 'animate-fade-in',
    slideInLeft: 'animate-slide-in-left',
    slideInRight: 'animate-slide-in-right',
    scaleIn: 'animate-scale-in',
  };

  const style = {
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
  };

  return (
    <div
      className={`${animationClasses[animation]} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};
```

---

## 🎯 베스트 프랙티스

### 1. 컴포넌트 설계 원칙

#### 단일 책임 원칙
```jsx
// ✅ 좋은 예: 하나의 역할만 담당
const Button = ({ children, onClick }) => (
  <button onClick={onClick} className="btn-primary">
    {children}
  </button>
);

// ❌ 나쁜 예: 여러 역할을 혼재
const Button = ({ children, onClick, showIcon, iconType, size, variant, ... }) => (
  // 너무 많은 props와 로직
);
```

#### 재사용 가능한 컴포넌트
```jsx
// ✅ 좋은 예: 유연한 컴포넌트
const Card = ({ children, className = '', ...props }) => (
  <div className={`card ${className}`} {...props}>
    {children}
  </div>
);

// 사용 예시
<Card className="hover:shadow-lg">
  <Card.Header>제목</Card.Header>
  <Card.Body>내용</Card.Body>
</Card>
```

### 2. 성능 최적화

#### 조건부 렌더링
```jsx
// ✅ 좋은 예: 조건부 렌더링
const Modal = ({ isOpen, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      {children}
    </div>
  );
};

// ❌ 나쁜 예: 항상 렌더링
const Modal = ({ isOpen, children }) => (
  <div className={`modal ${isOpen ? 'block' : 'hidden'}`}>
    {children}
  </div>
);
```

#### 메모이제이션
```jsx
// ✅ 좋은 예: 메모이제이션 사용
const ExpensiveComponent = React.memo(({ data }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      processed: heavyComputation(item)
    }));
  }, [data]);

  return (
    <div>
      {processedData.map(item => (
        <div key={item.id}>{item.processed}</div>
      ))}
    </div>
  );
});
```

### 3. 접근성 고려

#### 키보드 네비게이션
```jsx
// ✅ 좋은 예: 키보드 접근성
const TabList = ({ tabs, activeTab, onTabChange }) => {
  const handleKeyDown = (event, tabId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onTabChange(tabId);
    }
  };

  return (
    <div role="tablist">
      {tabs.map(tab => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
          onKeyDown={(e) => handleKeyDown(e, tab.id)}
          className={`tab ${activeTab === tab.id ? 'active' : ''}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
```

#### 스크린 리더 지원
```jsx
// ✅ 좋은 예: 스크린 리더 친화적
const IconButton = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    aria-label={label}
    className="icon-button"
  >
    {icon}
  </button>
);

// 사용 예시
<IconButton
  icon={<SearchIcon />}
  label="검색"
  onClick={handleSearch}
/>
```

---

## 📚 참고 자료

- [React 컴포넌트 패턴](https://reactpatterns.com/)
- [CSS Grid 가이드](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Flexbox 가이드](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [웹 접근성 가이드](https://www.w3.org/WAI/WCAG21/quickref/)

---

*이 문서는 프로젝트의 컴포넌트 스타일링 가이드라인을 제공합니다. 추가 질문이나 개선사항이 있으면 팀에 문의해주세요.*
