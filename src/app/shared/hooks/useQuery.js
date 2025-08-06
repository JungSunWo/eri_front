import { useQueryStore } from '@/app/core/slices/queryStore';
import { useCallback, useEffect, useRef } from 'react';

// 쿼리 훅 (개선된 버전)
export const useQuery = (key, fetcher, options = {}) => {
  const {
    executeQuery,
    getQueryState,
    invalidateQueries,
    updateQueryData
  } = useQueryStore();

  // 기본값 설정 및 사용자 입력값으로 덮어쓰기
  const {
    // 기본 동작 설정
    enabled = true,
    refetchOnWindowFocus = true,
    refetchOnMount = true,
    refetchInterval = false,

    // 캐시 설정
    cacheTime = 5 * 60 * 1000, // 5분
    staleTime = 0, // 즉시 stale로 간주

    // 재시도 설정
    retry = 3,
    retryDelay = 1000, // 1초

    // 에러 처리
    onError = null,
    onSuccess = null,

    // 기타 설정
    suspense = false,
    keepPreviousData = false,

    // 나머지 옵션들
    ...queryOptions
  } = options;

  const queryState = getQueryState(key);
  const intervalRef = useRef(null);
  const mountedRef = useRef(false);

  const refetch = useCallback(async () => {
    try {
      await executeQuery(key, fetcher, {
        cacheTime,
        staleTime,
        retry,
        retryDelay,
        onError,
        onSuccess,
        ...queryOptions
      });
    } catch (error) {
      console.error('Query refetch failed:', error);
      if (onError) {
        onError(error);
      }
    }
  }, [key, fetcher, executeQuery, cacheTime, staleTime, retry, retryDelay, onError, onSuccess, queryOptions]);

  // 컴포넌트 마운트 시 자동 실행
  useEffect(() => {
    if (enabled && refetchOnMount && !mountedRef.current) {
      mountedRef.current = true;
      if (!queryState.data && !queryState.isLoading) {
        refetch();
      }
    }
  }, [enabled, refetchOnMount, key, queryState.data, queryState.isLoading]);

  // 윈도우 포커스 시 리페치
  useEffect(() => {
    if (enabled && refetchOnWindowFocus) {
      const handleFocus = () => {
        if (queryState.isStale) {
          refetch();
        }
      };

      window.addEventListener('focus', handleFocus);
      return () => window.removeEventListener('focus', handleFocus);
    }
  }, [enabled, refetchOnWindowFocus, queryState.isStale]);

  // 주기적 리페치
  useEffect(() => {
    if (enabled && refetchInterval && typeof refetchInterval === 'number') {
      intervalRef.current = setInterval(() => {
        refetch();
      }, refetchInterval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null; // Explicitly nullify
        }
      };
    }
  }, [enabled, refetchInterval]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  // 수동 데이터 업데이트
  const updateData = useCallback((updater) => {
    updateQueryData(key, updater);
  }, [key, updateQueryData]);

  return {
    data: queryState.data,
    isLoading: queryState.isLoading,
    isFetching: queryState.isFetching,
    error: queryState.error,
    isStale: queryState.isStale,
    refetch,
    updateData
  };
};

// 뮤테이션 훅 (개선된 버전)
export const useMutation = (key, mutator, options = {}) => {
  const {
    executeMutation,
    getMutationState,
    invalidateQueries
  } = useQueryStore();

  // 기본값 설정 및 사용자 입력값으로 덮어쓰기
  const {
    // 콜백 함수들
    onSuccess = null,
    onError = null,
    onSettled = null,

    // 무효화 설정
    invalidateQueries: invalidateQueriesList = [],

    // 재시도 설정
    retry = 1,
    retryDelay = 1000, // 1초

    // 기타 설정
    optimisticUpdate = false,
    ...mutationOptions
  } = options;

  const mutationState = getMutationState(key);

  const mutate = useCallback(async (variables, mutationOptions = {}) => {
    const finalOptions = {
      onSuccess,
      onError,
      onSettled,
      invalidateQueries: invalidateQueriesList,
      retry,
      retryDelay,
      optimisticUpdate,
      ...mutationOptions
    };

    try {
      const result = await executeMutation(
        key,
        () => mutator(variables),
        finalOptions
      );

      // 성공 콜백 실행
      if (finalOptions.onSuccess) {
        finalOptions.onSuccess(result, variables);
      }

      // 완료 콜백 실행
      if (finalOptions.onSettled) {
        finalOptions.onSettled(result, null, variables);
      }

      return result;
    } catch (error) {
      console.error('Mutation failed:', error);

      // 에러 콜백 실행
      if (finalOptions.onError) {
        finalOptions.onError(error, variables);
      }

      // 완료 콜백 실행
      if (finalOptions.onSettled) {
        finalOptions.onSettled(undefined, error, variables);
      }

      throw error;
    }
  }, [key, mutator, executeMutation, onSuccess, onError, onSettled, invalidateQueriesList, retry, retryDelay, optimisticUpdate]);

  const mutateAsync = useCallback(async (variables, mutationOptions = {}) => {
    return mutate(variables, mutationOptions);
  }, [mutate]);

  return {
    mutate,
    mutateAsync,
    isLoading: mutationState.isLoading,
    error: mutationState.error,
    isError: !!mutationState.error
  };
};

// 무한 쿼리 훅 (개선된 버전)
export const useInfiniteQuery = (key, fetcher, options = {}) => {
  const {
    executeQuery,
    getQueryState,
    invalidateQueries
  } = useQueryStore();

  // 기본값 설정 및 사용자 입력값으로 덮어쓰기
  const {
    getNextPageParam = (data) => data?.nextCursor,
    getPreviousPageParam = (data) => data?.prevCursor,

    // 기본 쿼리 옵션들
    enabled = true,
    cacheTime = 5 * 60 * 1000,
    staleTime = 0,
    retry = 3,
    retryDelay = 1000,

    // 콜백 함수들
    onError = null,
    onSuccess = null,

    ...queryOptions
  } = options;

  const queryState = getQueryState(key);

  const fetchNextPage = useCallback(async (pageParam) => {
    try {
      const data = await executeQuery(
        `${key}-${pageParam}`,
        () => fetcher(pageParam),
        {
          cacheTime,
          staleTime,
          retry,
          retryDelay,
          onError,
          onSuccess,
          ...queryOptions
        }
      );
      return data;
    } catch (error) {
      console.error('Infinite query failed:', error);
      if (onError) {
        onError(error);
      }
      throw error;
    }
  }, [key, fetcher, executeQuery, cacheTime, staleTime, retry, retryDelay, onError, onSuccess, queryOptions]);

  const fetchPreviousPage = useCallback(async (pageParam) => {
    try {
      const data = await executeQuery(
        `${key}-prev-${pageParam}`,
        () => fetcher(pageParam),
        {
          cacheTime,
          staleTime,
          retry,
          retryDelay,
          onError,
          onSuccess,
          ...queryOptions
        }
      );
      return data;
    } catch (error) {
      console.error('Infinite query failed:', error);
      if (onError) {
        onError(error);
      }
      throw error;
    }
  }, [key, fetcher, executeQuery, cacheTime, staleTime, retry, retryDelay, onError, onSuccess, queryOptions]);

  return {
    data: queryState.data,
    isLoading: queryState.isLoading,
    isFetching: queryState.isFetching,
    error: queryState.error,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage: getNextPageParam ? getNextPageParam(queryState.data) : false,
    hasPreviousPage: getPreviousPageParam ? getPreviousPageParam(queryState.data) : false
  };
};

// 간단한 쿼리 훅 (자동 실행 없음)
export const useLazyQuery = (key, fetcher, options = {}) => {
  const query = useQuery(key, fetcher, { ...options, enabled: false });

  return {
    ...query,
    execute: query.refetch
  };
};

// 쿼리 상태만 가져오는 훅
export const useQueryState = (key) => {
  const { getQueryState } = useQueryStore();
  return getQueryState(key);
};

// 뮤테이션 상태만 가져오는 훅
export const useMutationState = (key) => {
  const { getMutationState } = useQueryStore();
  return getMutationState(key);
};
