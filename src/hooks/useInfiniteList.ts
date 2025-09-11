//useCommentList에 주석으로 자세히 코드 설명 되어있음
'use client';

import { useMemo } from 'react';
import { useInfiniteQuery, InfiniteData } from '@tanstack/react-query';

export type Cursor = number | null;

/**
 * 무한 스크롤 페이지 공통 타입
 * - list: 실제 아이템 배열
 * - nextCursor: 다음 페이지 커서(없으면 null/undefined)
 * - totalCount: 첫 페이지에 전체 개수 포함되는 형태 지원
 */

//한 페이지 응답 구조를 정의한 타입
export type CursorPage<TItem> = {
  list: TItem[]; // 실제 데이터 아이템 배열. 제네릭 TItem으로 타입 지정 → 어떤 타입의 데이터든 대응 가능
  nextCursor?: number | null;
  totalCount?: number;
};

// React Query에서 queryKey에 쓰이는 타입.
type Key = (string | number)[];

//훅의 옵션 타입 정의
export interface UseInfiniteListOptions<
  // TItem: 리스트 안에 들어가는 단일 아이템의 타입, "리스트의 원소" 타입
  TItem,
  // TPage:API가 반환하는 "페이지 단위 응답"의 타입
  // 이 페이지 응답은 반드시 CursorPage<TItem>를 상속해야 한다는 제약을 걸어둠
  // "페이지"는 최소한 list, nextCursor, totalCount를 가지고 있어야 함
  TPage extends CursorPage<TItem>,
> {
  /** React Query의 queryKey */
  //캐싱을 위한 key. React Query에서 데이터 구분할 때 씀.
  key: Key;

  /** 커서 기반 페이지 페처 (pageParam으로 전달되는 cursor를 인자로 받음) */
  // 실제로 데이터를 가져오는 함수.
  // 서버 API를 호출해서 TPage 형태의 응답을 반환해야 함.
  // cursor는 무한스크롤 페이징 기준점.
  fetchPage: (cursor: number | null) => Promise<TPage>;

  /** 쿼리 활성화 여부 (기본: key[1] 존재 여부) */
  // 쿼리를 실행할지 여부.
  // false면 자동으로 fetch 안 함.
  enabled?: boolean;

  /** React Query staleTime (기본: 60초) */
  // 캐시된 데이터가 fresh → stale 상태로 바뀌기까지의 시간(ms).
  staleTime?: number;

  /** React Query gcTime (기본: 5분) */
  // 가비지 컬렉션 시간(ms).
  // 사용하지 않는 쿼리 데이터를 메모리에서 지우는 시간.
  gcTime?: number;

  /**
   * 초깃값 커서 (기본: null)
   * 서버 커서가 특수한 초기값을 요구할 때 사용
   */
  initialCursor?: number | null;

  /**
   * 기존 코드 호환용 파라미터 (실사용 X)
   * - 캐싱키에 포함하지 않습니다. 필요하다면 key에 직접 넣어야함
   */
  // 과거 코드 호환을 위해 남겨둔 자리.
  // 실제 queryKey에 포함되지 않음.
  limitHint?: number;
}

/**
 * 공통 무한 스크롤 훅
 * - TanStack Query의 useInfiniteQuery 래핑
 * - items(플랫 배열)과 totalCount(첫 페이지 기반)를 편의 제공
 */
export function useInfiniteList<TItem, TPage extends CursorPage<TItem>>({
  key,
  fetchPage,
  enabled = true,
  staleTime = 60_000,
  gcTime = 5 * 60_000,
  initialCursor = null,
}: UseInfiniteListOptions<TItem, TPage>) {
  const query = useInfiniteQuery<
    TPage, //데이터 페이지 타입
    Error, // 에러 타입
    InfiniteData<TPage, number | null>, // 무한스크롤용 데이터 구조
    Key // ueryKey 타입
  >({
    queryKey: key, // 캐시 구분을 위한 key 지정
    // 데이터를 가져오는 함수
    // pageParam이 커서 값으로 전달되고, 없으면 null을 기본으로 사용
    queryFn: ({ pageParam }) => fetchPage((pageParam as number | null) ?? null),
    // 다음 페이지 요청할 때 다음 커서 값 반환
    // API가 nextCursor를 내려주면 그걸 사용
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
    // 첫 번째 호출 시 사용할 초기 커서 값
    initialPageParam: initialCursor,
    enabled,
    staleTime,
    gcTime,
  });

  const items = useMemo(
    () => query.data?.pages.flatMap((page) => page.list) ?? [],
    [query.data]
  );

  // 첫 페이지에서만 내려주는 totalCount를 추출, 없으면 0으로 처리
  const totalCount = query.data?.pages?.[0]?.totalCount ?? 0;

  // 원래 useInfiniteQuery에서 반환되는 것(data, isLoading, fetchNextPage 등)에
  // items (플랫 배열)과 totalCount까지 붙여서 반환.
  return {
    ...query,
    items,
    totalCount,
  };
}

export default useInfiniteList;
