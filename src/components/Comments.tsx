'use client';

import { useState } from 'react';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { formatAgo } from '@/util/date';
import { Button } from './ui/button';
import { Comments as CommentsType, List } from '@/types/comments';
import { getComments, updateComment, deleteComment } from '@/lib/api';
import CommentsCard from './CommentsCard';

const USER_ID = process.env.NEXT_PUBLIC_API_ID;
const TOKEN = process.env.NEXT_PUBLIC_API_TOKEN as string;

export default function Comments({ title }: { title: string }) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<CommentsType>({
      queryKey: ['comments'],
      queryFn: ({ pageParam }) =>
        getComments(
          pageParam
            ? `/comments?limit=4&cursor=${pageParam}`
            : '/comments?limit=4'
        ),
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      initialPageParam: null,
    });

  //data?.pages : useInfiniteQuery가 준 페이지 배열
  //예) [{ list: Comment[] , nextCursor: ... }, { list: Comment[] , ...}, ...]
  //각 page.list : 그 페이지의 댓글 배열 (Comment[])
  const comments = data?.pages.flatMap((page) => page.list) ?? [];

  return (
    <div>
      <h1>{title}</h1>
      {comments.map((comment) => (
        <CommentsCard
          key={comment.id}
          comment={comment}
          queryKey={['comments']}
          onFetchOne={(cursor) =>
            getComments(`/comments?limit=1&cursor=${cursor}`)
          }
        />
      ))}

      {hasNextPage && (
        <Button
          variant='outline'
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? '로딩중...' : '댓글 더보기'}
        </Button>
      )}
    </div>
  );
}
