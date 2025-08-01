# RTK Query 가이드

## 목차

1. [RTK Query란?](#rtk-query란)
2. [Zustand 기반 쿼리 시스템](#zustand-기반-쿼리-시스템)
3. [설치 및 설정](#설치-및-설정)
4. [기본 사용법](#기본-사용법)
5. [고급 기능](#고급-기능)
6. [실제 예시](#실제-예시)
7. [모범 사례](#모범-사례)
8. [문제 해결](#문제-해결)

---

## RTK Query란?

**RTK Query**는 Redux Toolkit에서 제공하는 강력한 데이터 페칭 및 캐싱 라이브러리입니다. React 애플리케이션에서 서버 상태를 관리하기 위한 현대적이고 효율적인 솔루션입니다.

### 주요 특징

- ✅ **자동 캐싱**: 데이터를 자동으로 캐싱하고 중복 요청 방지
- ✅ **실시간 동기화**: 서버 데이터와 클라이언트 상태를 자동으로 동기화
- ✅ **낙관적 업데이트**: 서버 응답을 기다리지 않고 즉시 UI 업데이트
- ✅ **타입 안전성**: TypeScript와 완벽한 통합
- ✅ **개발자 경험**: 보일러플레이트 코드 최소화

---

## Zustand 기반 쿼리 시스템

현재 프로젝트에서는 Zustand를 사용하여 RTK Query와 유사한 기능을 구현했습니다.

### 장점

- 🚀 **가벼움**: 추가 라이브러리 설치 불필요
- 🔧 **유연성**: 완전한 커스터마이징 가능
- 📚 **학습 곡선**: 기존 Zustand 지식 활용
- 📦 **번들 크기**: 더 작은 번들 크기

---

## 파일 구조

현재 프로젝트의 RTK Query 관련 파일들은 다음 경로에 위치합니다:

```
src/app/core/services/
├── queryStore.js      # Zustand 기반 쿼리 스토어
├── useQuery.js        # 커스텀 훅들 (useQuery, useMutation 등)
├── exampleUsage.js    # 사용 예시 컴포넌트들
└── api.js            # API 클라이언트 및 함수들
```

## 설치 및 설정

### Zustand 기반 시스템 (현재 프로젝트)

```bash
# 이미 설치됨
npm install zustand
```

### 기본 설정

```javascript
// store.js
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
```

---

## 기본 사용법

### 1. 쿼리 (Query)

#### 기본 쿼리

```javascript
import { useQuery } from "@/app/core/services/useQuery";

function UserList() {
  const { data, isLoading, error, refetch } = useQuery(
    "users",
    userAPI.getUsers
  );

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;

  return (
    <div>
      {data?.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

#### 고급 옵션

```javascript
const { data, isLoading, error } = useQuery("users", userAPI.getUsers, {
  enabled: true, // 자동 실행 여부
  retry: 3, // 재시도 횟수
  cacheTime: 10 * 60 * 1000, // 캐시 시간 (10분)
  refetchOnWindowFocus: true, // 윈도우 포커스 시 리페치
  refetchInterval: 30000, // 30초마다 자동 새로고침
});
```

### 2. 뮤테이션 (Mutation)

#### 기본 뮤테이션

```javascript
import { useMutation } from "@/app/core/services/useQuery";

function CreateUser() {
  const { mutate, isLoading, error } = useMutation(
    "createUser",
    userAPI.createUser,
    {
      onSuccess: (data) => {
        console.log("사용자 생성 성공:", data);
        // 캐시 무효화
        refetch();
      },
      onError: (error) => {
        console.error("사용자 생성 실패:", error);
      },
    }
  );

  const handleSubmit = (userData) => {
    mutate(userData);
  };

  return (
    <button onClick={() => handleSubmit({ name: "John" })}>사용자 생성</button>
  );
}
```

### 3. 지연 실행 쿼리 (Lazy Query)

```javascript
import { useLazyQuery } from "@/app/core/services/useQuery";

function SearchComponent() {
  const { data, execute, isLoading } = useLazyQuery("search", searchAPI.search);

  return (
    <div>
      <input
        type="text"
        placeholder="검색어 입력"
        onChange={(e) => {
          if (e.target.value.length > 2) {
            execute();
          }
        }}
      />
      <button onClick={execute}>검색</button>
    </div>
  );
}
```

### 4. 무한 쿼리 (Infinite Query)

```javascript
import { useInfiniteQuery } from "@/app/core/services/useQuery";

function InfiniteUserList() {
  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery(
    "users-infinite",
    ({ pageParam = 1 }) => userAPI.getUsersPaginated(pageParam),
    {
      getNextPageParam: (lastPage) => {
        return lastPage.hasNextPage ? lastPage.nextPage : undefined;
      },
    }
  );

  return (
    <div>
      {data?.pages?.map((page, pageIndex) => (
        <div key={pageIndex}>
          {page.data.map((user) => (
            <div key={user.id}>{user.name}</div>
          ))}
        </div>
      ))}

      {hasNextPage && <button onClick={fetchNextPage}>더 보기</button>}
    </div>
  );
}
```

---

## 고급 기능

### 1. 캐시 관리

#### 캐시 무효화

```javascript
import { useQueryStore } from "@/app/core/services/queryStore";

const { invalidateQueries, clearCache } = useQueryStore();

// 특정 쿼리 무효화
invalidateQueries(["users", "posts"]);

// 모든 캐시 클리어
clearCache();
```

#### 수동 데이터 업데이트

```javascript
const { updateData } = useQuery("user", userAPI.getUser);

const { mutate } = useMutation("updateUser", userAPI.updateUser, {
  onSuccess: (data) => {
    // 즉시 UI 업데이트
    updateData((oldData) => ({
      ...oldData,
      ...data,
    }));
  },
});
```

### 2. 실시간 업데이트

```javascript
function RealTimeData() {
  const { data, refetch } = useQuery("realtime-data", api.getData, {
    refetchInterval: 5000, // 5초마다 자동 새로고침
    refetchOnWindowFocus: true, // 윈도우 포커스 시 새로고침
    cacheTime: 5 * 60 * 1000, // 5분 캐시
  });

  return (
    <div>
      <button onClick={refetch}>수동 새로고침</button>
      {/* 데이터 표시 */}
    </div>
  );
}
```

### 3. 에러 처리 및 재시도

```javascript
const { data, error } = useQuery("users", userAPI.getUsers, {
  retry: 3, // 3번 재시도
  retryDelay: 1000, // 1초 간격
  onError: (error) => {
    console.error("쿼리 실패:", error);
  },
});
```

### 4. 조건부 쿼리

```javascript
function UserDetail({ userId }) {
  const { data, isLoading } = useQuery(
    ["user", userId],
    () => userAPI.getUser(userId),
    {
      enabled: !!userId, // userId가 있을 때만 실행
      retry: 2,
    }
  );

  if (!userId) return <div>사용자 ID가 필요합니다.</div>;
  if (isLoading) return <div>로딩 중...</div>;

  return <div>{data?.name}</div>;
}
```

---

## 실제 예시

### 1. 사용자 관리 시스템

```javascript
// API 함수들
const userAPI = {
  getUsers: async () => {
    const response = await apiClient.get("/users");
    return response.data;
  },

  getUser: async (id) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (userData) => {
    const response = await apiClient.post("/users", userData);
    return response.data;
  },

  updateUser: async ({ id, ...userData }) => {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },
};

// 사용자 목록 컴포넌트
function UserList() {
  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useQuery("users", userAPI.getUsers, {
    cacheTime: 10 * 60 * 1000,
    retry: 3,
    refetchOnWindowFocus: true,
  });

  const { mutate: createUser, isLoading: isCreating } = useMutation(
    "createUser",
    userAPI.createUser,
    {
      onSuccess: () => refetch(),
      onError: (error) => alert("사용자 생성 실패"),
    }
  );

  const { mutate: deleteUser, isLoading: isDeleting } = useMutation(
    "deleteUser",
    userAPI.deleteUser,
    {
      onSuccess: () => refetch(),
      onError: (error) => alert("사용자 삭제 실패"),
    }
  );

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;

  return (
    <div>
      <h2>사용자 목록</h2>
      <button onClick={refetch}>새로고침</button>

      {users?.map((user) => (
        <div key={user.id}>
          <span>{user.name}</span>
          <button onClick={() => deleteUser(user.id)} disabled={isDeleting}>
            삭제
          </button>
        </div>
      ))}
    </div>
  );
}
```

### 2. 검색 시스템

```javascript
function SearchSystem() {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: searchResults,
    execute,
    isLoading,
  } = useLazyQuery("search", () => searchAPI.search(searchTerm), {
    cacheTime: 5 * 60 * 1000,
  });

  const handleSearch = useCallback(() => {
    if (searchTerm.trim()) {
      execute();
    }
  }, [searchTerm, execute]);

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="검색어 입력"
      />
      <button onClick={handleSearch} disabled={isLoading}>
        검색
      </button>

      {isLoading && <div>검색 중...</div>}
      {searchResults && (
        <div>
          {searchResults.map((item) => (
            <div key={item.id}>{item.name}</div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 모범 사례

### 1. 쿼리 키 관리

```javascript
// 좋은 예시
const QUERY_KEYS = {
  USERS: "users",
  USER: (id) => ["user", id],
  POSTS: "posts",
  POST: (id) => ["post", id],
};

// 사용
const { data } = useQuery(QUERY_KEYS.USERS, userAPI.getUsers);
const { data } = useQuery(QUERY_KEYS.USER(userId), () =>
  userAPI.getUser(userId)
);
```

### 2. 에러 처리

```javascript
function ErrorBoundary({ children }) {
  return <div>{children}</div>;
}

function UserComponent() {
  const { data, error, isLoading } = useQuery("users", userAPI.getUsers);

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러가 발생했습니다: {error}</div>;

  return <div>{/* 데이터 표시 */}</div>;
}
```

### 3. 로딩 상태 관리

```javascript
function LoadingStates() {
  const { data, isLoading, isFetching } = useQuery("users", userAPI.getUsers);

  return (
    <div>
      {isLoading && <div>초기 로딩 중...</div>}
      {isFetching && !isLoading && <div>데이터 새로고침 중...</div>}
      {data && <div>{/* 데이터 표시 */}</div>}
    </div>
  );
}
```

### 4. 캐시 최적화

```javascript
// 자주 변경되지 않는 데이터
const { data } = useQuery("config", configAPI.getConfig, {
  cacheTime: 60 * 60 * 1000, // 1시간
  staleTime: 30 * 60 * 1000, // 30분
});

// 실시간 데이터
const { data } = useQuery("realtime", realtimeAPI.getData, {
  refetchInterval: 5000, // 5초마다
  cacheTime: 5 * 60 * 1000, // 5분
});
```

---

## 문제 해결

### 1. 일반적인 문제들

#### 캐시가 업데이트되지 않는 경우

```javascript
// 해결 방법: 캐시 무효화
const { invalidateQueries } = useQueryStore();

const { mutate } = useMutation("updateUser", userAPI.updateUser, {
  onSuccess: () => {
    invalidateQueries(["users"]); // 관련 쿼리 무효화
  },
});
```

#### 무한 리렌더링

```javascript
// 문제가 있는 코드
const { data } = useQuery("users", () => userAPI.getUsers(params));

// 해결 방법: 안정적인 키 사용
const { data } = useQuery(["users", params], () => userAPI.getUsers(params));
```

#### 메모리 누수

```javascript
// 컴포넌트 언마운트 시 정리
useEffect(() => {
  return () => {
    // 필요한 정리 작업
  };
}, []);
```

### 2. 디버깅

#### 개발자 도구 사용

```javascript
// Zustand DevTools 활성화
import { devtools } from "zustand/middleware";

export const useQueryStore = create(
  devtools(
    (set, get) => ({
      // 스토어 로직
    }),
    { name: "query-store" }
  )
);
```

#### 로깅

```javascript
const { data, error } = useQuery("users", userAPI.getUsers, {
  onSuccess: (data) => {
    console.log("쿼리 성공:", data);
  },
  onError: (error) => {
    console.error("쿼리 실패:", error);
  },
});
```

---

## 성능 최적화

### 1. 쿼리 최적화

```javascript
// 필요한 데이터만 요청
const { data } = useQuery(["users", { fields: "id,name" }], () =>
  userAPI.getUsers({ fields: "id,name" })
);

// 페이지네이션 사용
const { data } = useQuery(["users", { page, limit }], () =>
  userAPI.getUsers({ page, limit })
);
```

### 2. 캐시 최적화

```javascript
// 적절한 캐시 시간 설정
const { data } = useQuery("users", userAPI.getUsers, {
  cacheTime: 10 * 60 * 1000, // 10분
  staleTime: 5 * 60 * 1000, // 5분
});
```

### 3. 번들 크기 최적화

```javascript
// 필요한 기능만 import
import { useQuery, useMutation } from "@/app/core/services/useQuery";
```

---

## 마이그레이션 가이드

### 기존 axios 코드에서 마이그레이션

#### Before (기존 코드)

```javascript
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const fetchUsers = async () => {
  setLoading(true);
  try {
    const response = await axios.get("/users");
    setUsers(response.data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchUsers();
}, []);
```

#### After (RTK Query 스타일)

```javascript
const {
  data: users,
  isLoading,
  error,
  refetch,
} = useQuery("users", userAPI.getUsers);
```

---

## 결론

RTK Query와 Zustand 기반 쿼리 시스템은 모두 강력한 데이터 페칭 솔루션을 제공합니다.

**RTK Query 선택 시기:**

- 대규모 프로젝트
- 복잡한 캐싱 요구사항
- Redux 생태계 사용
- 완성된 기능이 필요한 경우

**Zustand 기반 시스템 선택 시기:**

- 가벼운 프로젝트
- 커스터마이징이 중요한 경우
- 기존 Zustand 사용
- 번들 크기 최적화가 중요한 경우

현재 프로젝트에서는 Zustand 기반 시스템이 더 적합할 수 있으며, 필요에 따라 RTK Query로 마이그레이션할 수 있습니다.
