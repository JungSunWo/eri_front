import axios from 'axios';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// 캐시 관리
const cache = new Map();

// API 클라이언트
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
});

// 캐시 유효성 검사 (기본 5분)
const isCacheValid = (timestamp, cacheTime = 5 * 60 * 1000) => {
  return Date.now() - timestamp < cacheTime;
};

// 캐시 키 생성 함수 (개선된 버전)
const createCacheKey = (key) => {
  if (typeof key === 'string') {
    return key;
  }

  if (Array.isArray(key)) {
    return key.map(item =>
      typeof item === 'object' ? JSON.stringify(item) : String(item)
    ).join('|');
  }

  if (typeof key === 'object') {
    // 객체의 키를 정렬하여 일관된 캐시 키 생성
    const sortedKeys = Object.keys(key).sort();
    return sortedKeys.map(k => `${k}:${JSON.stringify(key[k])}`).join('|');
  }

  return String(key);
};

// 에러 타입 분류
const classifyError = (error) => {
  if (error.response) {
    // 서버 응답이 있는 경우
    const { status, data } = error.response;
    return {
      type: 'response',
      status,
      message: data?.message || `HTTP ${status} 에러`,
      data: data
    };
  } else if (error.request) {
    // 요청은 보냈지만 응답이 없는 경우
    return {
      type: 'network',
      message: '네트워크 연결 오류',
      original: error
    };
  } else {
    // 요청 설정 중 오류
    return {
      type: 'request',
      message: error.message || '요청 설정 오류',
      original: error
    };
  }
};

export const useQueryStore = create(
  devtools(
    (set, get) => ({
      // 상태
      queries: {},
      mutations: {},

      // 쿼리 실행 (개선된 버전)
      executeQuery: async (key, fetcher, options = {}) => {
        const {
          cacheTime = 5 * 60 * 1000, // 5분
          staleTime = 0,
          refetchOnWindowFocus = true,
          enabled = true, // 자동 실행 여부
          retry = 3, // 재시도 횟수
          retryDelay = 1000 // 재시도 간격
        } = options;

        // 비활성화된 경우
        if (!enabled) {
          return null;
        }

        const cacheKey = createCacheKey(key);
        const cached = cache.get(cacheKey);

        // 캐시된 데이터가 있고 유효한 경우
        if (cached && isCacheValid(cached.timestamp, cacheTime)) {
          set((state) => ({
            queries: {
              ...state.queries,
              [cacheKey]: {
                ...cached,
                isLoading: false,
                isFetching: false,
                error: null,
                isStale: false
              }
            }
          }));
          return cached.data;
        }

        // 로딩 상태 설정
        set((state) => ({
          queries: {
            ...state.queries,
            [cacheKey]: {
              data: cached?.data || null,
              isLoading: true,
              isFetching: true,
              error: null,
              timestamp: Date.now(),
              isStale: false
            }
          }
        }));

        // 재시도 로직
        let lastError;
        for (let attempt = 0; attempt <= retry; attempt++) {
          try {
            const data = await fetcher();

            // 캐시에 저장
            cache.set(cacheKey, {
              data,
              timestamp: Date.now()
            });

            // 성공 상태 설정
            set((state) => ({
              queries: {
                ...state.queries,
                [cacheKey]: {
                  data,
                  isLoading: false,
                  isFetching: false,
                  error: null,
                  timestamp: Date.now(),
                  isStale: false
                }
              }
            }));

            return data;
          } catch (error) {
            lastError = error;
            const classifiedError = classifyError(error);

            if (attempt < retry) {
              // 재시도 전 대기
              await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
              continue;
            }

            // 최종 에러 상태 설정
            set((state) => ({
              queries: {
                ...state.queries,
                [cacheKey]: {
                  data: cached?.data || null,
                  isLoading: false,
                  isFetching: false,
                  error: classifiedError,
                  timestamp: cached?.timestamp || Date.now(),
                  isStale: false
                }
              }
            }));
            throw classifiedError;
          }
        }
      },

      // 뮤테이션 실행 (개선된 버전)
      executeMutation: async (key, mutator, options = {}) => {
        const {
          onSuccess,
          onError,
          invalidateQueries = [],
          optimisticUpdate = null, // 낙관적 업데이트 함수
          retry = 1
        } = options;

        set((state) => ({
          mutations: {
            ...state.mutations,
            [key]: {
              isLoading: true,
              error: null
            }
          }
        }));

        // 낙관적 업데이트 실행
        if (optimisticUpdate) {
          optimisticUpdate();
        }

        let lastError;
        for (let attempt = 0; attempt <= retry; attempt++) {
          try {
            const result = await mutator();

            // 성공 시 캐시 무효화
            if (invalidateQueries.length > 0) {
              get().invalidateQueries(invalidateQueries);
            }

            set((state) => ({
              mutations: {
                ...state.mutations,
                [key]: {
                  isLoading: false,
                  error: null
                }
              }
            }));

            if (onSuccess) onSuccess(result);
            return result;
          } catch (error) {
            lastError = error;
            const classifiedError = classifyError(error);

            if (attempt < retry) {
              await new Promise(resolve => setTimeout(resolve, 1000));
              continue;
            }

            set((state) => ({
              mutations: {
                ...state.mutations,
                [key]: {
                  isLoading: false,
                  error: classifiedError
                }
              }
            }));

            if (onError) onError(classifiedError);
            throw classifiedError;
          }
        }
      },

      // 쿼리 상태 가져오기
      getQueryState: (key) => {
        const cacheKey = createCacheKey(key);
        return get().queries[cacheKey] || {
          data: null,
          isLoading: false,
          isFetching: false,
          error: null,
          isStale: false
        };
      },

      // 뮤테이션 상태 가져오기
      getMutationState: (key) => {
        return get().mutations[key] || {
          isLoading: false,
          error: null
        };
      },

      // 캐시 무효화
      invalidateQueries: (queryKeys) => {
        queryKeys.forEach(queryKey => {
          const cacheKey = createCacheKey(queryKey);
          cache.delete(cacheKey);

          set((state) => {
            const newQueries = { ...state.queries };
            delete newQueries[cacheKey];
            return { queries: newQueries };
          });
        });
      },

      // 특정 쿼리만 무효화
      invalidateQuery: (queryKey) => {
        get().invalidateQueries([queryKey]);
      },

      // 캐시 클리어
      clearCache: () => {
        cache.clear();
        set({ queries: {}, mutations: {} });
      },

      // 쿼리 상태 업데이트 (수동)
      updateQueryData: (key, updater) => {
        const cacheKey = createCacheKey(key);
        const currentState = get().queries[cacheKey];

        if (currentState) {
          const newData = updater(currentState.data);
          set((state) => ({
            queries: {
              ...state.queries,
              [cacheKey]: {
                ...currentState,
                data: newData
              }
            }
          }));

          // 캐시도 업데이트
          cache.set(cacheKey, {
            data: newData,
            timestamp: currentState.timestamp
          });
        }
      }
    }),
    { name: 'query-store' }
  )
);
