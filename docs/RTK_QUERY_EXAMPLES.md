# RTK Query 스타일 Zustand 훅 사용 예제

## 기본 사용법

### 1. useQuery 훅

```javascript
import { useQuery } from "@/hooks/useQuery";

function NoticeList() {
  const { data, isLoading, error, refetch } = useQuery(
    "notices",
    () => noticeAPI.getNoticeList(),
    {
      enabled: true,
      refetchOnWindowFocus: true,
      refetchInterval: 30000,
    }
  );

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error.message}</div>;

  return (
    <div>
      {data?.map((notice) => (
        <div key={notice.id}>{notice.title}</div>
      ))}
    </div>
  );
}
```

### 2. useMutation 훅

```javascript
import { useMutation } from "@/hooks/useQuery";

function CreateNotice() {
  const { mutate, isLoading, error } = useMutation(
    "createNotice",
    (newNotice) => noticeAPI.createNotice(newNotice),
    {
      onSuccess: (data) => {
        console.log("공지사항 생성 성공:", data);
        invalidateQueries("notices");
      },
      onError: (error) => {
        console.error("공지사항 생성 실패:", error);
      },
    }
  );

  const handleSubmit = (formData) => {
    mutate(formData);
  };

  return <form onSubmit={handleSubmit}>{/* 폼 내용 */}</form>;
}
```

### 3. useLazyQuery 훅

```javascript
import { useLazyQuery } from "@/hooks/useQuery";

function SearchComponent() {
  const { data, isLoading, execute } = useLazyQuery("search", (searchTerm) =>
    searchAPI.search(searchTerm)
  );

  const handleSearch = (term) => {
    execute(term);
  };

  return (
    <div>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {isLoading && <div>검색 중...</div>}
      {data && <div>검색 결과: {data.length}개</div>}
    </div>
  );
}
```

### 4. useInfiniteQuery 훅

```javascript
import { useInfiniteQuery } from "@/hooks/useQuery";

function InfiniteNoticeList() {
  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery(
    "infiniteNotices",
    (pageParam) => noticeAPI.getNoticeList({ page: pageParam }),
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  );

  return (
    <div>
      {data?.pages.map((page, i) => (
        <div key={i}>
          {page.data.map((notice) => (
            <div key={notice.id}>{notice.title}</div>
          ))}
        </div>
      ))}
      {hasNextPage && <button onClick={() => fetchNextPage()}>더 보기</button>}
    </div>
  );
}
```

## 고급 사용법

### 1. 조건부 쿼리

```javascript
function ConditionalQuery() {
  const [userId, setUserId] = useState(null);

  const { data, isLoading } = useQuery(
    ["user", userId],
    () => userAPI.getUser(userId),
    {
      enabled: !!userId, // userId가 있을 때만 실행
      retry: 2,
      retryDelay: 1000,
    }
  );

  return (
    <div>
      <input
        type="text"
        placeholder="사용자 ID 입력"
        onChange={(e) => setUserId(e.target.value)}
      />
      {isLoading && <div>로딩 중...</div>}
      {data && <div>사용자: {data.name}</div>}
    </div>
  );
}
```

### 2. 실시간 데이터

```javascript
function RealTimeData() {
  const { data, refetch } = useQuery(
    "realtime-data",
    () => api.getRealTimeData(),
    {
      refetchInterval: 5000, // 5초마다 자동 갱신
      refetchOnWindowFocus: true,
      cacheTime: 5 * 60 * 1000, // 5분 캐시
    }
  );

  return (
    <div>
      <button onClick={refetch}>수동 갱신</button>
      <div>실시간 데이터: {data?.value}</div>
    </div>
  );
}
```

### 3. 낙관적 업데이트

```javascript
function OptimisticUpdate() {
  const { mutate } = useMutation(
    "updateNotice",
    (updatedNotice) => noticeAPI.updateNotice(updatedNotice),
    {
      onMutate: async (newNotice) => {
        // 이전 데이터 백업
        const previousNotices = queryClient.getQueryData("notices");

        // 낙관적 업데이트
        queryClient.setQueryData("notices", (old) =>
          old.map((notice) => (notice.id === newNotice.id ? newNotice : notice))
        );

        return { previousNotices };
      },
      onError: (err, newNotice, context) => {
        // 오류 시 이전 데이터 복원
        queryClient.setQueryData("notices", context.previousNotices);
      },
      onSettled: () => {
        // 완료 후 쿼리 무효화
        queryClient.invalidateQueries("notices");
      },
    }
  );

  const handleUpdate = (notice) => {
    mutate(notice);
  };

  return <button onClick={() => handleUpdate(updatedNotice)}>업데이트</button>;
}
```

## 파일 구조

```
src/
├── app/
│   ├── shared/
│   │   └── hooks/
│   │       └── useQuery.js          # 메인 쿼리 훅들
│   └── core/
│       ├── slices/
│       │   └── queryStore.js        # Zustand 스토어
│       └── services/
│           ├── apiClient.js          # API 클라이언트
│           ├── api.js                # API 통합 export
│           ├── api/                  # 도메인별 API
│           │   ├── authAPI.js
│           │   ├── noticeAPI.js
│           │   └── ...
│           └── exampleUsage.js       # 사용 예제
```

## 성능 최적화

### 1. 캐시 관리

```javascript
import { useQueryStore } from "@/slices/queryStore";

const { invalidateQueries, clearCache, updateQueryData } = useQueryStore();

// 특정 쿼리 무효화
invalidateQueries("notices");

// 여러 쿼리 한 번에 무효화
invalidateQueries(["notices", "users", "settings"]);

// 조건부 무효화
invalidateQueries((queryKey) => queryKey.startsWith("notices"));

// 캐시 전체 삭제
clearCache();

// 수동 데이터 업데이트
updateQueryData("notices", (oldData) => {
  return oldData.map((notice) =>
    notice.id === updatedNotice.id ? updatedNotice : notice
  );
});
```

### 2. 배치 처리

```javascript
// 여러 뮤테이션을 한 번에 처리
const { mutate: createNotice } = useMutation(
  "createNotice",
  noticeAPI.createNotice
);
const { mutate: createUser } = useMutation("createUser", userAPI.createUser);

const handleBatchCreate = async (data) => {
  try {
    await Promise.all([createNotice(data.notice), createUser(data.user)]);

    // 모든 관련 쿼리 무효화
    invalidateQueries(["notices", "users"]);
  } catch (error) {
    console.error("배치 생성 실패:", error);
  }
};
```

### 3. 에러 처리

```javascript
function ErrorHandling() {
  const { data, error, isLoading } = useQuery(
    "notices",
    () => noticeAPI.getNoticeList(),
    {
      retry: 3,
      retryDelay: 1000,
      onError: (error) => {
        console.error("쿼리 실패:", error);
        // 에러 알림 표시
        showErrorNotification(error.message);
      },
    }
  );

  if (error) {
    return (
      <div className="error-container">
        <h3>오류가 발생했습니다</h3>
        <p>{error.message}</p>
        <button onClick={() => refetch()}>다시 시도</button>
      </div>
    );
  }

  return <div>{/* 데이터 표시 */}</div>;
}
```
