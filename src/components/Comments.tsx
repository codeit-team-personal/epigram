'use client';

import { useState } from 'react';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { formatAgo } from '@/util/date';
import { Button } from './ui/button';
import { Comments as CommentsType } from '@/types/comments';
import { getComments, updateComment, deleteComment } from '@/lib/api';

const USER_ID = process.env.NEXT_PUBLIC_API_ID;
const TOKEN = process.env.NEXT_PUBLIC_API_TOKEN as string;

export default function Comments({ title }: { title: string }) {
  const queryClient = useQueryClient();

  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  // 댓글 리스트 (무한 스크롤)

  const {
    data,
    fetchNextPage, //다음 페이지의 데이터를 로드하는 함수
    hasNextPage, // 다음 페이지가 있는지 여부
    isFetchingNextPage, // 다음 페이지를 불러오는 중인지 여부
  } = useInfiniteQuery<CommentsType>({
    queryKey: ['comments'],
    //pageParam의 첫 값은 undefined
    queryFn: ({ pageParam }) =>
      getComments(
        pageParam
          ? `/comments?limit=4&cursor=${pageParam}`
          : '/comments?limit=4'
      ),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    // 초기 페이지 설정값
    initialPageParam: null,
  });

  // 댓글 수정
  const updateMutation = useMutation({
    mutationFn: updateComment,
    onSuccess: (updated) => {
      queryClient.setQueryData(['comments'], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: CommentsType) => ({
            ...page,
            list: page.list.map((c) => (c.id === updated.id ? updated : c)),
          })),
        };
      });
      setEditingId(null);
    },
  });

  // 댓글 삭제
  const deleteMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: (_, id) => {
      queryClient.setQueryData(['comments'], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: CommentsType) => ({
            ...page,
            list: page.list.filter((c) => c.id !== id),
          })),
        };
      });
    },
  });

  //data?.pages : useInfiniteQuery가 준 페이지 배열
  //예) [{ list: Comment[] , nextCursor: ... }, { list: Comment[] , ...}, ...]
  //각 page.list : 그 페이지의 댓글 배열 (Comment[])
  const comments = data?.pages.flatMap((page) => page.list) ?? [];

  return (
    <div>
      <h1>{title}</h1>
      {comments.map((comment) => (
        <div
          //페이지가 달라도 id가 전역 고유라면 OK. 중복 가능성이 있으면 createdAt도 써줌
          key={`${comment.id}-${comment.createdAt}`}
          onMouseEnter={() => setHoveredId(comment.id)}
          onMouseLeave={() => setHoveredId(null)}
          className='relative p-2 border-b'
        >
          <p className='flex items-center gap-2'>
            <span className='font-semibold'>{comment.writer.nickname}</span>
            <span className='text-gray-500 text-sm'>
              {formatAgo(comment.createdAt, 'ko')}
            </span>
          </p>

          {editingId === comment.id ? (
            <div className='mt-1 flex gap-2'>
              <input
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className='border p-1 flex-1'
              />
              <button
                onClick={() =>
                  updateMutation.mutate({
                    id: comment.id,
                    content: editContent,
                  })
                }
                className='text-sm text-blue-500'
              >
                저장
              </button>
              <button
                onClick={() => setEditingId(null)}
                className='text-sm text-gray-500'
              >
                취소
              </button>
            </div>
          ) : (
            <p className='mt-1'>{comment.content}</p>
          )}

          {hoveredId === comment.id &&
            Number(USER_ID) === comment.writer.id && (
              <div className='absolute right-2 top-2 flex gap-2'>
                <Button
                  className='text-sm text-blue-500 hover:underline'
                  onClick={() => {
                    setEditingId(comment.id);
                    setEditContent(comment.content);
                  }}
                >
                  수정
                </Button>
                <Button
                  className='text-sm text-red-500 hover:underline'
                  onClick={() => deleteMutation.mutate(comment.id)}
                >
                  삭제
                </Button>
              </div>
            )}
        </div>
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
