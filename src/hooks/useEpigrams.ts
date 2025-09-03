'use client';

import { useInfiniteQuery, InfiniteData } from '@tanstack/react-query';
import { EpigramResponse } from '@/types/today';
import { getEpigram } from '@/lib/api';

interface UseEpigramsProps {
  firstLimit?: number;
  nextLimit?: number;
}

interface PageParam {
  cursor: number;
  pageIndex: number;
}

export function useEpigrams({
  firstLimit = 3,
  nextLimit = 5,
}: UseEpigramsProps) {
  return useInfiniteQuery<
    EpigramResponse, // TData: 쿼리 함수가 반환하는 데이터 타입
    Error, // TError: 쿼리 중 에러 타입
    // TData (select/처리 후): 데이터 선택/가공 후 타입
    //useInfiniteQuery는 무한 스크롤 구조라서 data.pages라는 배열을 반환함
    InfiniteData<EpigramResponse>,
    (string | number)[], // TQueryKey: queryKey 타입
    PageParam // TPageParam: getNextPageParam / pageParam 구조
  >({
    queryKey: ['epigrams', firstLimit, nextLimit],
    queryFn: ({ pageParam }) => {
      const pageIndex = pageParam?.pageIndex ?? 0;
      const cursor = pageParam?.cursor ?? 0;

      const limit = pageIndex === 0 ? firstLimit : nextLimit;

      return getEpigram({ limit, cursor });
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.nextCursor
        ? { cursor: lastPage.nextCursor, pageIndex: allPages.length }
        : null,
    initialPageParam: { cursor: 0, pageIndex: 0 },
  });
}
