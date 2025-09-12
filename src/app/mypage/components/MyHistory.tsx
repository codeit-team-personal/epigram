'use client';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useInfiniteQuery, InfiniteData } from '@tanstack/react-query';

import EpigramCard from '@/components/EpigramCard';
import CommentsCard from '@/components/CommentCard';
import { Button } from '@/components/ui/button';

import { User } from '@/types/user';
import { Comments as CommentsType } from '@/types/comments';
import { getMyComments, getMyEpigrams } from '@/lib/api';
import { EpigramResponse } from '@/types/today';
import useInfiniteList from '@/hooks/useInfiniteList';

interface MyHistoryProps {
  user: User | null;
}

type Tab = 'epigram' | 'comment';

// -----------------------------
// UI helpers
// -----------------------------
function CountBadge({ count }: { count: number }) {
  //if (count <= 0) return null;
  return <span aria-label={`총 ${count}개`}>({count})</span>;
}

function LoadMoreButton({
  label,
  onClick,
  disabled,
  variant = 'outline',
  icon = false,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?:
    | 'outline'
    | 'plus'
    | 'default'
    | 'secondary'
    | 'ghost'
    | 'destructive';
  icon?: boolean;
}) {
  return (
    <div className='mt-4 flex justify-center'>
      <Button
        className={
          variant === 'plus'
            ? undefined
            : 'flex items-center gap-2 rounded-full border border-line-200 bg-transparent px-4 py-2 lg:text-xl text-sm text-blue-500 hover:bg-gray-50 lg:w-[238px] lg:h-[56px] w-[153px] h-[48px]'
        }
        variant={variant}
        size={variant === 'plus' ? 'plus' : undefined}
        onClick={onClick}
        disabled={disabled}
        aria-disabled={disabled}
      >
        {icon && <Plus className='size-6 text-blue-500' aria-hidden />}
        <span
          className={variant === 'plus' ? 'text-xl text-blue-500' : undefined}
        >
          {label}
        </span>
      </Button>
    </div>
  );
}

export default function MyHistory({ user }: MyHistoryProps) {
  const [tab, setTab] = useState<Tab>('epigram');

  if (!user) return <div>로그인이 필요합니다.</div>;

  const writerId = user.id;

  // 내 에피그램 무한스크롤
  const epigramsQuery = useInfiniteList<
    EpigramResponse['list'][number],
    EpigramResponse
  >({
    key: ['myEpigrams', writerId],
    fetchPage: (cursor) =>
      getMyEpigrams({ writerId, limit: 3, cursor: cursor ?? undefined }),
  });

  // 내 댓글 무한스크롤 (limit=3)
  const commentsQuery = useInfiniteList<
    CommentsType['list'][number],
    CommentsType
  >({
    key: ['myComments', writerId],
    fetchPage: (cursor) =>
      getMyComments({
        userId: writerId,
        limit: 4,
        cursor: cursor ?? undefined,
      }),
  });

  const handleTab = useCallback((next: Tab) => setTab(next), []);

  return (
    <div className='w-[640px] mx-auto mt-20 mb-40'>
      {/* 탭 선택 */}
      <div className='mb-15 flex gap-2'>
        <Button
          variant={tab === 'epigram' ? 'history' : 'historyoutline'}
          onClick={() => handleTab('epigram')}
          aria-pressed={tab === 'epigram'}
        >
          내 에피그램 ({epigramsQuery.totalCount})
        </Button>
        <Button
          variant={tab === 'comment' ? 'history' : 'historyoutline'}
          onClick={() => handleTab('comment')}
          aria-pressed={tab === 'comment'}
        >
          내 댓글({commentsQuery.totalCount})
        </Button>
      </div>

      {/* 내 에피그램 */}
      {tab === 'epigram' && (
        <section aria-label='내 에피그램 목록'>
          {epigramsQuery.isLoading && <div>에피그램 불러오는 중...</div>}
          {epigramsQuery.isError && (
            <div>에피그램을 불러오는 중 문제가 발생했어요.</div>
          )}
          {!epigramsQuery.isLoading && epigramsQuery.items.length === 0 && (
            <div>작성한 에피그램이 없습니다.</div>
          )}

          {epigramsQuery.items.map((e) => (
            <Link key={e.id} href={`/detail/${e.id}`}>
              <EpigramCard data={e} />
            </Link>
          ))}

          {epigramsQuery.hasNextPage && (
            <LoadMoreButton
              variant='plus'
              icon
              onClick={() => epigramsQuery.fetchNextPage()}
              disabled={epigramsQuery.isFetchingNextPage}
              label={
                epigramsQuery.isFetchingNextPage
                  ? '에피그램 로딩중'
                  : '에피그램 더보기'
              }
            />
          )}
        </section>
      )}

      {/* 내 댓글 */}
      {tab === 'comment' && (
        <section aria-label='내 댓글 목록'>
          {commentsQuery.isLoading && <div>댓글 불러오는 중...</div>}
          {commentsQuery.isError && (
            <div>댓글을 불러오는 중 문제가 발생했어요.</div>
          )}
          {!commentsQuery.isLoading && commentsQuery.items.length === 0 && (
            <div>작성한 댓글이 없습니다.</div>
          )}

          {commentsQuery.items.map((comment) => (
            <CommentsCard
              key={comment.id}
              comment={comment}
              queryKey={['myComments', writerId]}
              onFetchOne={(cursor) =>
                getMyComments({ userId: writerId, limit: 1, cursor })
              }
            />
          ))}

          {commentsQuery.hasNextPage && (
            <LoadMoreButton
              variant='plus'
              icon
              onClick={() => commentsQuery.fetchNextPage()}
              disabled={commentsQuery.isFetchingNextPage}
              label={
                commentsQuery.isFetchingNextPage ? '댓글 로딩중' : '댓글 더보기'
              }
            />
          )}
        </section>
      )}
    </div>
  );
}
