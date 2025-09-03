'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import CommentsCard from '@/components/CommentsCard';
import { getEpigramDetailComments } from '@/lib/api';
import { useCommentList } from '@/hooks/useCommentList';
import { useCommentMutation } from '@/hooks/useCommentMutation';

export default function EpiDetailCommentList() {
  const params = useParams();
  const epigramId = Number(params.id);

  const {
    comments,
    totalCount,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCommentList(epigramId);

  const mutation = useCommentMutation(epigramId);

  const [content, setContent] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [active, setActive] = useState(false);

  // 댓글 작성 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    mutation.mutate(
      { epigramId, isPrivate, content },
      {
        onSuccess: () => {
          setContent('');
          setActive(false);
        },
      }
    );
  };

  return (
    <div>
      <div className='p-4'>
        <div className='font-semibold mb-2'>댓글 {totalCount}개</div>
        <form onSubmit={handleSubmit} className='space-y-2'>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setActive(true)}
            className='w-full border rounded p-2'
            rows={3}
            placeholder='댓글을 입력하세요'
          />
          {active && (
            <div className='flex gap-2 items-center'>
              <button
                type='button'
                onClick={() => setIsPrivate((prev) => !prev)}
                className='px-3 py-1 border rounded'
              >
                {isPrivate ? '비공개' : '공개'}
              </button>
              <button
                type='submit'
                className='px-4 py-1 bg-blue-500 text-white rounded'
                disabled={mutation.isPending}
              >
                저장
              </button>
            </div>
          )}
        </form>
      </div>

      {/* 댓글 리스트 */}
      {comments.map((comment) => (
        <CommentsCard
          key={comment.id}
          comment={comment}
          queryKey={['comments', epigramId]}
          onFetchOne={(cursor) =>
            getEpigramDetailComments({ epigramId, limit: 1, cursor })
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
