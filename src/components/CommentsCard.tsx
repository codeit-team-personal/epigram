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
import {
  getComments,
  updateComment,
  deleteComment,
  getEpigramDetailComments,
} from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Image from 'next/image';

export default function CommentsCard({
  comment,
  queryKey,
  onFetchOne,
}: {
  comment: List;
  queryKey: (string | number)[];
  onFetchOne: (cursor: number) => Promise<CommentsType>;
}) {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  // 댓글 수정
  const updateMutation = useMutation({
    mutationFn: updateComment,
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKey, (oldData: any) => {
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

  // 댓글 삭제 + 1개 보충
  const deleteMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: async (_, id) => {
      queryClient.setQueryData(queryKey, (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: CommentsType) => ({
            ...page,
            list: page.list.filter((c) => c.id !== id),
          })),
        };
      });

      // 1개 보충 로직
      const oldData: any = queryClient.getQueryData(queryKey);
      const lastPage = oldData?.pages[oldData.pages.length - 1];
      if (onFetchOne && lastPage?.nextCursor) {
        const newPage = await onFetchOne(lastPage.nextCursor);

        queryClient.setQueryData(queryKey, (old: any) => {
          if (!old) return old;
          const updatedPages = [...old.pages];
          const last = updatedPages[updatedPages.length - 1];

          updatedPages[updatedPages.length - 1] = {
            ...last,
            list: [...last.list, ...newPage.list],
            nextCursor: newPage.nextCursor,
          };

          return { ...old, pages: updatedPages };
        });
      }
      //댓글 삭제하면 바로 업데이트
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return (
    <div className='flex relative p-2 border-t group pt-10 justify-center'>
      <div className='mr-4 w-[48px] h-[48px] rounded-full overflow-hidden flex-shrink-0'>
        <Image
          src={comment.writer.image || '/images/default-profile.jpg'}
          alt={`${comment.writer.nickname} 프로필`}
          width={48}
          height={48}
          className='object-cover w-full h-full'
        />
      </div>
      <div className='w-[530px]'>
        <p className='flex items-center gap-2 font-normal text-black-300 text-base '>
          <span>{comment.writer.nickname}</span>
          <span>{formatAgo(comment.createdAt, 'ko')}</span>
        </p>

        {editingId === comment.id ? (
          <div className='mt-1 flex gap-2'>
            <input
              type='textarea'
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className='border p-1 flex-1 text-black-300'
            />
            <button
              type='button'
              onClick={() => setIsPrivate((prev) => !prev)}
              className='px-3 py-1 border rounded'
            >
              {isPrivate ? '비공개' : '공개'}
            </button>
            <button
              onClick={() =>
                updateMutation.mutate({
                  id: comment.id,
                  content: editContent,
                  isPrivate: isPrivate,
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
          <p className='mt-1 text-black-550 font-normal text-xl mb-5 mt-3 leading-8'>
            {comment.content}
          </p>
        )}
      </div>

      {Number(user?.id) === comment.writer.id && (
        <div className='absolute right-2 top-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
          <Button
            className='text-sm text-blue-500 hover:underline'
            onClick={() => {
              setEditingId(comment.id);
              setEditContent(comment.content);
            }}
          >
            수정
          </Button>

          <AlertDialog>
            <AlertDialogTrigger>Open</AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  댓글을 삭제하시겠어요?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteMutation.mutate(comment.id)}
                >
                  삭제
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
}
