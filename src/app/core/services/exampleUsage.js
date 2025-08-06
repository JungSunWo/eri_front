import { useInfiniteQuery, useLazyQuery, useMutation, useQuery } from '@/app/shared/hooks/useQuery';
import { apiClient } from './apiClient';

// API 함수들
const userAPI = {
  // 사용자 목록 조회
  getUsers: async (params = {}) => {
    const response = await apiClient.get('/users', { params });
    return response.data;
  },

  // 사용자 상세 조회
  getUser: async (id) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  // 사용자 생성
  createUser: async (userData) => {
    const response = await apiClient.post('/users', userData);
    return response.data;
  },

  // 사용자 수정
  updateUser: async ({ id, ...userData }) => {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  },

  // 사용자 삭제
  deleteUser: async (id) => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },

  // 페이지네이션된 사용자 목록
  getUsersPaginated: async (page = 1, limit = 10) => {
    const response = await apiClient.get('/users', {
      params: { page, limit }
    });
    return response.data;
  }
};

// 기본 사용자 목록 컴포넌트
export const UserList = () => {
  // 자동 실행되는 쿼리
  const {
    data: users,
    isLoading,
    error,
    refetch
  } = useQuery('users', userAPI.getUsers, {
    cacheTime: 10 * 60 * 1000, // 10분 캐시
    retry: 3, // 3번 재시도
    refetchOnWindowFocus: true // 윈도우 포커스 시 리페치
  });

  // 뮤테이션
  const {
    mutate: createUser,
    isLoading: isCreating
  } = useMutation('createUser', userAPI.createUser, {
    onSuccess: (data) => {
      console.log('사용자 생성 성공:', data);
      refetch(); // 목록 새로고침
    },
    onError: (error) => {
      console.error('사용자 생성 실패:', error);
    }
  });

  const {
    mutate: deleteUser,
    isLoading: isDeleting
  } = useMutation('deleteUser', userAPI.deleteUser, {
    onSuccess: () => {
      console.log('사용자 삭제 성공');
      refetch();
    }
  });

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;

  return (
    <div>
      <h2>사용자 목록</h2>
      <button onClick={refetch}>새로고침</button>

      {users?.map(user => (
        <div key={user.id}>
          <span>{user.name}</span>
          <button
            onClick={() => deleteUser(user.id)}
            disabled={isDeleting}
          >
            삭제
          </button>
        </div>
      ))}
    </div>
  );
};

// 개별 사용자 상세 조회
export const UserDetail = ({ userId }) => {
  const {
    data: user,
    isLoading,
    error,
    updateData // 수동 데이터 업데이트
  } = useQuery(
    ['user', userId],
    () => userAPI.getUser(userId),
    {
      enabled: !!userId, // userId가 있을 때만 실행
      retry: 2
    }
  );

  const {
    mutate: updateUser,
    isLoading: isUpdating
  } = useMutation('updateUser', userAPI.updateUser, {
    onSuccess: (data) => {
      console.log('사용자 수정 성공:', data);
      // 낙관적 업데이트
      updateData((oldData) => ({
        ...oldData,
        ...data
      }));
    }
  });

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;

  return (
    <div>
      <h2>사용자 상세</h2>
      {user && (
        <div>
          <p>이름: {user.name}</p>
          <p>이메일: {user.email}</p>
          <button
            onClick={() => updateUser({ id: userId, name: '새 이름' })}
            disabled={isUpdating}
          >
            수정
          </button>
        </div>
      )}
    </div>
  );
};

// 지연 실행 쿼리 (수동 실행)
export const LazyUserSearch = () => {
  const {
    data: searchResults,
    isLoading,
    error,
    execute
  } = useLazyQuery('userSearch', userAPI.getUsers, {
    cacheTime: 5 * 60 * 1000
  });

  const handleSearch = (searchTerm) => {
    execute();
  };

  return (
    <div>
      <input
        type="text"
        placeholder="검색어 입력"
        onChange={(e) => handleSearch(e.target.value)}
      />
      <button onClick={() => execute()}>검색</button>

      {isLoading && <div>검색 중...</div>}
      {error && <div>에러: {error}</div>}
      {searchResults && (
        <div>
          {searchResults.map(user => (
            <div key={user.id}>{user.name}</div>
          ))}
        </div>
      )}
    </div>
  );
};

// 무한 스크롤 사용자 목록
export const InfiniteUserList = () => {
  const {
    data: users,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage
  } = useInfiniteQuery(
    'users-infinite',
    ({ pageParam = 1 }) => userAPI.getUsersPaginated(pageParam, 10),
    {
      getNextPageParam: (lastPage) => {
        return lastPage.hasNextPage ? lastPage.nextPage : undefined;
      },
      cacheTime: 10 * 60 * 1000
    }
  );

  const handleLoadMore = () => {
    if (hasNextPage && !isLoading) {
      fetchNextPage();
    }
  };

  if (error) return <div>에러: {error}</div>;

  return (
    <div>
      <h2>무한 스크롤 사용자 목록</h2>

      {users?.pages?.map((page, pageIndex) => (
        <div key={pageIndex}>
          {page.data.map(user => (
            <div key={user.id}>{user.name}</div>
          ))}
        </div>
      ))}

      {isLoading && <div>로딩 중...</div>}
      {hasNextPage && (
        <button onClick={handleLoadMore}>
          더 보기
        </button>
      )}
    </div>
  );
};

// 실시간 업데이트가 필요한 컴포넌트
export const RealTimeUserList = () => {
  const {
    data: users,
    isLoading,
    error,
    refetch
  } = useQuery('users-realtime', userAPI.getUsers, {
    refetchInterval: 30 * 1000, // 30초마다 자동 새로고침
    refetchOnWindowFocus: true,
    cacheTime: 5 * 60 * 1000
  });

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;

  return (
    <div>
      <h2>실시간 사용자 목록</h2>
      <button onClick={refetch}>수동 새로고침</button>

      {users?.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
};
