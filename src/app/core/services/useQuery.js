import { useCallback, useEffect, useRef } from 'react';
import { useQueryStore } from './queryStore';

// 쿼리 훅 (개선된 버전)
export const useQuery = (key, fetcher, options = {}) => {
  const {
    executeQuery,
    getQueryState,
    invalidateQueries,
    updateQueryData
  } = useQueryStore();

  const {
    enabled = true,
    refetchOnWindowFocus = true,
    refetchOnMount = true,
    refetchInterval = false,
    ...queryOptions
  } = options;

  const queryState = getQueryState(key);
  const intervalRef = useRef(null);
  const mountedRef = useRef(false);

  const refetch = useCallback(async () => {
    try {
      await executeQuery(key, fetcher, queryOptions);
    } catch (error) {
      console.error('Query refetch failed:', error);
    }
  }, [key, fetcher, executeQuery, queryOptions]);

  // 컴포넌트 마운트 시 자동 실행
  useEffect(() => {
    if (enabled && refetchOnMount && !mountedRef.current) {
      mountedRef.current = true;
      if (!queryState.data && !queryState.isLoading) {
        refetch();
      }
    }
  }, [enabled, refetchOnMount, key]);

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
  }, [enabled, refetchOnWindowFocus, queryState.isStale, refetch]);

  // 주기적 리페치
  useEffect(() => {
    if (enabled && refetchInterval && typeof refetchInterval === 'number') {
      intervalRef.current = setInterval(() => {
        refetch();
      }, refetchInterval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [enabled, refetchInterval, refetch]);

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

  const mutationState = getMutationState(key);

  const mutate = useCallback(async (variables, mutationOptions = {}) => {
    const finalOptions = { ...options, ...mutationOptions };

    try {
      const result = await executeMutation(
        key,
        () => mutator(variables),
        finalOptions
      );
      return result;
    } catch (error) {
      console.error('Mutation failed:', error);
      throw error;
    }
  }, [key, mutator, executeMutation, options]);

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

  const {
    getNextPageParam,
    getPreviousPageParam,
    ...queryOptions
  } = options;

  const queryState = getQueryState(key);

  const fetchNextPage = useCallback(async (pageParam) => {
    try {
      const data = await executeQuery(
        `${key}-${pageParam}`,
        () => fetcher(pageParam),
        queryOptions
      );
      return data;
    } catch (error) {
      console.error('Infinite query failed:', error);
      throw error;
    }
  }, [key, fetcher, executeQuery, queryOptions]);

  const fetchPreviousPage = useCallback(async (pageParam) => {
    try {
      const data = await executeQuery(
        `${key}-prev-${pageParam}`,
        () => fetcher(pageParam),
        queryOptions
      );
      return data;
    } catch (error) {
      console.error('Infinite query failed:', error);
      throw error;
    }
  }, [key, fetcher, executeQuery, queryOptions]);

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
