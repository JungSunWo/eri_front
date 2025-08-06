# RTK Query 시스템 사용 가이드

## 개요

이 프로젝트에서는 Zustand를 사용하여 RTK Query와 유사한 데이터 페칭 시스템을 구현했습니다.

## 파일 구조

```
src/app/core/services/
├── queryStore.js      # Zustand 기반 쿼리 스토어
├── useQuery.js        # 커스텀 훅들 (useQuery, useMutation 등)
├── exampleUsage.js    # 사용 예시 컴포넌트들
└── api.js            # API 클라이언트 및 함수들
```

## 기본 사용법

### 1. 쿼리 (데이터 조회)

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

### 2. 뮤테이션 (데이터 변경)

```javascript
import { useMutation } from "@/app/core/services/useQuery";

function CreateUser() {
  const { mutate, isLoading } = useMutation("createUser", userAPI.createUser, {
    onSuccess: (data) => {
      console.log("사용자 생성 성공:", data);
      refetch(); // 목록 새로고침
    },
    onError: (error) => {
      console.error("사용자 생성 실패:", error);
    },
  });

  return (
    <button
      onClick={() => mutate({ name: "John", email: "john@example.com" })}
      disabled={isLoading}
    >
      사용자 생성
    </button>
  );
}
```

### 3. 지연 실행 쿼리

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

## 고급 옵션

### 쿼리 옵션

```javascript
const { data } = useQuery("users", userAPI.getUsers, {
  enabled: true, // 자동 실행 여부
  retry: 3, // 재시도 횟수
  cacheTime: 10 * 60 * 1000, // 캐시 시간 (10분)
  refetchOnWindowFocus: true, // 윈도우 포커스 시 리페치
  refetchInterval: 30000, // 30초마다 자동 새로고침
});
```

### 뮤테이션 옵션

```javascript
const { mutate } = useMutation("updateUser", userAPI.updateUser, {
  onSuccess: (data) => {
    // 성공 시 처리
  },
  onError: (error) => {
    // 에러 시 처리
  },
  invalidateQueries: ["users"], // 캐시 무효화할 쿼리들
});
```

## 캐시 관리

```javascript
import { useQueryStore } from "@/app/core/slices/queryStore";

const { invalidateQueries, clearCache } = useQueryStore();

// 특정 쿼리 무효화
invalidateQueries(["users", "posts"]);

// 모든 캐시 클리어
clearCache();
```

## 사용 예시

더 자세한 사용 예시는 `exampleUsage.js` 파일을 참고하세요.

## 문서

- [RTK Query 가이드](../docs/RTK_QUERY_GUIDE.md)
- [RTK Query 예시](../docs/RTK_QUERY_EXAMPLES.md)
