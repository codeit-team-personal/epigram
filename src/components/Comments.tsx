'use client';

import { Plus } from 'lucide-react';
import { Button } from './ui/button';
import CommentsCard from './CommentCard';
import { Comments as CommentsType } from '@/types/comments';
import { getComments } from '@/lib/api';
import useInfiniteList from '@/hooks/useInfiniteList';

export default function Comments({ title }: { title: string }) {
  const {
    items: comments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteList<CommentsType['list'][number], CommentsType>({
    key: ['comments'],
    fetchPage: (cursor) => getComments({ limit: 4, cursor }),
    enabled: true,
    initialCursor: null,
  });

  if (isLoading) return <div>댓글 불러오는 중…</div>;
  if (isError) return <div>댓글을 불러오는 중 문제가 발생했어요.</div>;

  return (
    <div className="mb-30">
      <h1 className="text-common mb-10">{title}</h1>

      {comments.map((comment) => (
        <CommentsCard
          key={comment.id}
          comment={comment}
          queryKey={['comments']}
          onFetchOne={(cursor) => getComments({ limit: 1, cursor })}
        />
      ))}

      {hasNextPage && (
        <div className="flex justify-center mt-4 cursor-pointer">
          <Button
            variant="plus"
            size="plus"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            <Plus className="text-blue-500 size-6" />
            <div className="text-blue-500 text-xl">
              {isFetchingNextPage ? '댓글 로딩중' : '댓글 더보기'}
            </div>
          </Button>
        </div>
      )}
    </div>
  );
}
