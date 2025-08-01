# RTK Query 사용 예시

## 목차

1. [파일 구조](#파일-구조)
2. [기본 예시](#기본-예시)
3. [실제 프로젝트 예시](#실제-프로젝트-예시)
4. [고급 패턴](#고급-패턴)
5. [성능 최적화 예시](#성능-최적화-예시)

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

사용 예시는 `exampleUsage.js` 파일에서 확인할 수 있습니다.

---

## 기본 예시

### 1. 간단한 사용자 목록

```javascript
import { useQuery, useMutation } from "@/app/core/services/useQuery";

// API 함수
const userAPI = {
  getUsers: async () => {
    const response = await apiClient.get("/users");
    return response.data;
  },

  createUser: async (userData) => {
    const response = await apiClient.post("/users", userData);
    return response.data;
  },
};

// 컴포넌트
function UserList() {
  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useQuery("users", userAPI.getUsers);

  const { mutate: createUser, isLoading: isCreating } = useMutation(
    "createUser",
    userAPI.createUser,
    {
      onSuccess: () => refetch(),
      onError: (error) => alert("사용자 생성 실패"),
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
          <span>{user.email}</span>
        </div>
      ))}

      <button
        onClick={() =>
          createUser({ name: "새 사용자", email: "new@example.com" })
        }
        disabled={isCreating}
      >
        사용자 추가
      </button>
    </div>
  );
}
```

### 2. 검색 기능

```javascript
import { useLazyQuery } from "@/app/core/services/useQuery";
import { useState, useCallback } from "react";

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: results,
    execute,
    isLoading,
  } = useLazyQuery("search", () => searchAPI.search(searchTerm), {
    cacheTime: 5 * 60 * 1000, // 5분 캐시
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
        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
      />
      <button onClick={handleSearch} disabled={isLoading}>
        {isLoading ? "검색 중..." : "검색"}
      </button>

      {results && (
        <div>
          <h3>검색 결과</h3>
          {results.map((item) => (
            <div key={item.id}>{item.name}</div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 3. 무한 스크롤

```javascript
import { useInfiniteQuery } from "@/app/core/services/useQuery";

function InfiniteUserList() {
  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery(
      "users-infinite",
      ({ pageParam = 1 }) => userAPI.getUsersPaginated(pageParam, 10),
      {
        getNextPageParam: (lastPage) => {
          return lastPage.hasNextPage ? lastPage.nextPage : undefined;
        },
        cacheTime: 10 * 60 * 1000,
      }
    );

  return (
    <div>
      <h2>사용자 목록 (무한 스크롤)</h2>

      {data?.pages?.map((page, pageIndex) => (
        <div key={pageIndex}>
          {page.data.map((user) => (
            <div key={user.id}>
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </div>
          ))}
        </div>
      ))}

      {isFetchingNextPage && <div>다음 페이지 로딩 중...</div>}

      {hasNextPage && (
        <button onClick={fetchNextPage} disabled={isFetchingNextPage}>
          더 보기
        </button>
      )}
    </div>
  );
}
```

---

## 실제 프로젝트 예시

### 1. 게시판 시스템

```javascript
// API 함수들
const boardAPI = {
  getPosts: async (params = {}) => {
    const response = await apiClient.get("/posts", { params });
    return response.data;
  },

  getPost: async (id) => {
    const response = await apiClient.get(`/posts/${id}`);
    return response.data;
  },

  createPost: async (postData) => {
    const response = await apiClient.post("/posts", postData);
    return response.data;
  },

  updatePost: async ({ id, ...postData }) => {
    const response = await apiClient.put(`/posts/${id}`, postData);
    return response.data;
  },

  deletePost: async (id) => {
    const response = await apiClient.delete(`/posts/${id}`);
    return response.data;
  },
};

// 게시글 목록
function PostList() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("all");

  const {
    data: posts,
    isLoading,
    error,
    refetch,
  } = useQuery(
    ["posts", { page, category }],
    () => boardAPI.getPosts({ page, category }),
    {
      cacheTime: 5 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    }
  );

  const { mutate: deletePost, isLoading: isDeleting } = useMutation(
    "deletePost",
    boardAPI.deletePost,
    {
      onSuccess: () => refetch(),
      onError: (error) => alert("게시글 삭제 실패"),
    }
  );

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;

  return (
    <div>
      <div>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">전체</option>
          <option value="notice">공지사항</option>
          <option value="free">자유게시판</option>
        </select>
      </div>

      {posts?.data?.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <span>{post.author}</span>
          <span>{post.createdAt}</span>
          <button onClick={() => deletePost(post.id)} disabled={isDeleting}>
            삭제
          </button>
        </div>
      ))}

      <div>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          이전
        </button>
        <span>{page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!posts?.hasNextPage}
        >
          다음
        </button>
      </div>
    </div>
  );
}

// 게시글 상세
function PostDetail({ postId }) {
  const {
    data: post,
    isLoading,
    error,
    updateData,
  } = useQuery(["post", postId], () => boardAPI.getPost(postId), {
    enabled: !!postId,
    retry: 2,
  });

  const { mutate: updatePost, isLoading: isUpdating } = useMutation(
    "updatePost",
    boardAPI.updatePost,
    {
      onSuccess: (data) => {
        updateData((oldData) => ({
          ...oldData,
          ...data,
        }));
      },
    }
  );

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <span>작성자: {post.author}</span>
      <span>작성일: {post.createdAt}</span>

      <button
        onClick={() =>
          updatePost({
            id: postId,
            title: "수정된 제목",
            content: "수정된 내용",
          })
        }
        disabled={isUpdating}
      >
        수정
      </button>
    </div>
  );
}
```

### 2. 실시간 알림 시스템

```javascript
function NotificationSystem() {
  const { data: notifications, refetch } = useQuery(
    "notifications",
    notificationAPI.getNotifications,
    {
      refetchInterval: 30 * 1000, // 30초마다 새로고침
      refetchOnWindowFocus: true,
      cacheTime: 5 * 60 * 1000,
    }
  );

  const { mutate: markAsRead, isLoading } = useMutation(
    "markAsRead",
    notificationAPI.markAsRead,
    {
      onSuccess: () => refetch(),
    }
  );

  return (
    <div>
      <h3>알림 ({notifications?.filter((n) => !n.read).length})</h3>

      {notifications?.map((notification) => (
        <div
          key={notification.id}
          className={notification.read ? "read" : "unread"}
        >
          <p>{notification.message}</p>
          <span>{notification.createdAt}</span>
          {!notification.read && (
            <button
              onClick={() => markAsRead(notification.id)}
              disabled={isLoading}
            >
              읽음 표시
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
```

### 3. 파일 업로드 시스템

```javascript
function FileUpload() {
  const {
    mutate: uploadFile,
    isLoading,
    error,
  } = useMutation("uploadFile", fileAPI.uploadFile, {
    onSuccess: (data) => {
      console.log("파일 업로드 성공:", data);
      // 성공 후 처리
    },
    onError: (error) => {
      console.error("파일 업로드 실패:", error);
      alert("파일 업로드에 실패했습니다.");
    },
  });

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      uploadFile(formData);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} disabled={isLoading} />

      {isLoading && <div>업로드 중...</div>}
      {error && <div>에러: {error}</div>}
    </div>
  );
}
```

---

## 고급 패턴

### 1. 낙관적 업데이트

```javascript
function OptimisticUpdate() {
  const { data: posts, updateData } = useQuery("posts", postAPI.getPosts);

  const { mutate: likePost, isLoading } = useMutation(
    "likePost",
    postAPI.likePost,
    {
      onSuccess: (data) => {
        // 서버 응답으로 데이터 업데이트
        updateData((oldData) =>
          oldData.map((post) =>
            post.id === data.postId ? { ...post, likes: data.likes } : post
          )
        );
      },
      onError: (error) => {
        // 에러 시 원래 상태로 되돌리기
        console.error("좋아요 실패:", error);
      },
    }
  );

  const handleLike = (postId) => {
    // 낙관적 업데이트
    updateData((oldData) =>
      oldData.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );

    // 서버 요청
    likePost(postId);
  };

  return (
    <div>
      {posts?.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <button onClick={() => handleLike(post.id)} disabled={isLoading}>
            좋아요 ({post.likes})
          </button>
        </div>
      ))}
    </div>
  );
}
```

### 2. 조건부 쿼리

```javascript
function ConditionalQueries() {
  const [userId, setUserId] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // 사용자 목록 (항상 실행)
  const { data: users } = useQuery("users", userAPI.getUsers);

  // 선택된 사용자 상세 (userId가 있을 때만)
  const { data: userDetail } = useQuery(
    ["user", userId],
    () => userAPI.getUser(userId),
    {
      enabled: !!userId,
      retry: 2,
    }
  );

  // 사용자 통계 (showDetails가 true일 때만)
  const { data: userStats } = useQuery(
    ["user-stats", userId],
    () => userAPI.getUserStats(userId),
    {
      enabled: !!userId && showDetails,
      cacheTime: 10 * 60 * 1000,
    }
  );

  return (
    <div>
      <div>
        <select onChange={(e) => setUserId(e.target.value)}>
          <option value="">사용자 선택</option>
          {users?.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      {userDetail && (
        <div>
          <h3>{userDetail.name}</h3>
          <p>{userDetail.email}</p>

          <button onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? "통계 숨기기" : "통계 보기"}
          </button>

          {showDetails && userStats && (
            <div>
              <h4>통계</h4>
              <p>게시글 수: {userStats.postCount}</p>
              <p>댓글 수: {userStats.commentCount}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

### 3. 쿼리 키 관리

```javascript
// 쿼리 키 상수
const QUERY_KEYS = {
  USERS: "users",
  USER: (id) => ["user", id],
  USER_POSTS: (userId) => ["user-posts", userId],
  POSTS: "posts",
  POST: (id) => ["post", id],
  COMMENTS: (postId) => ["comments", postId],
  SEARCH: (term) => ["search", term],
};

// 사용 예시
function QueryKeyManagement() {
  const { data: users } = useQuery(QUERY_KEYS.USERS, userAPI.getUsers);

  const { data: user } = useQuery(
    QUERY_KEYS.USER(userId),
    () => userAPI.getUser(userId),
    { enabled: !!userId }
  );

  const { data: posts } = useQuery(
    QUERY_KEYS.USER_POSTS(userId),
    () => postAPI.getUserPosts(userId),
    { enabled: !!userId }
  );

  const { mutate: updateUser } = useMutation("updateUser", userAPI.updateUser, {
    onSuccess: () => {
      // 관련 쿼리들 무효화
      invalidateQueries([QUERY_KEYS.USERS, QUERY_KEYS.USER(userId)]);
    },
  });

  return <div>{/* 컴포넌트 내용 */}</div>;
}
```

---

## 성능 최적화 예시

### 1. 가상화된 목록

```javascript
import { FixedSizeList as List } from "react-window";

function VirtualizedUserList() {
  const { data: users, isLoading } = useQuery("users", userAPI.getUsers, {
    cacheTime: 10 * 60 * 1000,
  });

  if (isLoading) return <div>로딩 중...</div>;

  const Row = ({ index, style }) => (
    <div style={style}>
      <div>{users[index].name}</div>
      <div>{users[index].email}</div>
    </div>
  );

  return (
    <List height={400} itemCount={users?.length || 0} itemSize={50}>
      {Row}
    </List>
  );
}
```

### 2. 메모이제이션

```javascript
import { useMemo, useCallback } from "react";

function OptimizedUserList() {
  const { data: users, isLoading } = useQuery("users", userAPI.getUsers);

  // 사용자 목록 메모이제이션
  const sortedUsers = useMemo(() => {
    if (!users) return [];
    return [...users].sort((a, b) => a.name.localeCompare(b.name));
  }, [users]);

  // 필터링된 사용자
  const [filter, setFilter] = useState("");
  const filteredUsers = useMemo(() => {
    if (!filter) return sortedUsers;
    return sortedUsers.filter((user) =>
      user.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [sortedUsers, filter]);

  // 이벤트 핸들러 메모이제이션
  const handleUserClick = useCallback((userId) => {
    // 사용자 클릭 처리
  }, []);

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <div>
      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="사용자 검색"
      />

      {filteredUsers.map((user) => (
        <div key={user.id} onClick={() => handleUserClick(user.id)}>
          {user.name}
        </div>
      ))}
    </div>
  );
}
```

### 3. 배치 업데이트

```javascript
function BatchUpdate() {
  const { data: posts, updateData } = useQuery("posts", postAPI.getPosts);

  const { mutate: updateMultiplePosts } = useMutation(
    "updateMultiplePosts",
    postAPI.updateMultiplePosts,
    {
      onSuccess: (updatedPosts) => {
        // 배치로 여러 게시글 업데이트
        updateData((oldData) =>
          oldData.map((post) => {
            const updatedPost = updatedPosts.find((p) => p.id === post.id);
            return updatedPost || post;
          })
        );
      },
    }
  );

  const handleBatchUpdate = () => {
    const selectedPosts = posts?.filter((post) => post.selected) || [];
    const updates = selectedPosts.map((post) => ({
      id: post.id,
      status: "published",
    }));

    updateMultiplePosts(updates);
  };

  return (
    <div>
      {posts?.map((post) => (
        <div key={post.id}>
          <input
            type="checkbox"
            checked={post.selected || false}
            onChange={(e) => {
              updateData((oldData) =>
                oldData.map((p) =>
                  p.id === post.id ? { ...p, selected: e.target.checked } : p
                )
              );
            }}
          />
          <span>{post.title}</span>
        </div>
      ))}

      <button onClick={handleBatchUpdate}>선택된 게시글 일괄 업데이트</button>
    </div>
  );
}
```

이러한 예시들을 통해 RTK Query와 Zustand 기반 쿼리 시스템의 다양한 사용 패턴을 학습할 수 있습니다. 프로젝트의 요구사항에 맞게 적절한 패턴을 선택하여 사용하시기 바랍니다.
