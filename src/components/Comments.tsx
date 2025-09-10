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
import CommentsCard from './CommentCard';
import { Plus } from 'lucide-react';

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
    <div className='mb-30'>
      <h1 className='text-common mb-10'>{title}</h1>
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
        <div className='flex justify-center mt-4 cursor-pointer'>
          <Button
            variant='plus'
            size='plus'
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            <Plus className='text-blue-500 size-6' />
            <div className='text-blue-500 text-xl  '>
              {isFetchingNextPage ? '댓글 로딩중' : '댓글 더보기'}
            </div>
          </Button>
        </div>
      )}
    </div>
  );
}
