'use client';

import { useInfiniteQuery, InfiniteData } from '@tanstack/react-query';
import { Comments as CommentsType } from '@/types/comments';
import { getEpigramDetailComments } from '@/lib/api';

export function useCommentList(epigramId: number) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<
      CommentsType,
      Error,
      InfiniteData<CommentsType, number | null>,
      [string, number],
      number | null
    >({
      queryKey: ['comments', epigramId],
      queryFn: ({ pageParam }) =>
        getEpigramDetailComments({
          epigramId,
          limit: 3,
          cursor: pageParam,
        }),
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
      initialPageParam: null,
      enabled: !!epigramId,
    });

  const comments = data?.pages.flatMap((page) => page.list) ?? [];
  const totalCount = data?.pages[0]?.totalCount ?? 0;

  return {
    comments,
    totalCount,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}
