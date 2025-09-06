'use client';

import { Epigram } from '@/types/today';
import EpigramCard from '@/components/EpigramCard';
import { Button } from '@/components/ui/button';
import { useEpigrams } from '@/hooks/useEpigrams';

export default function Feed({
  firstLimit = 6,
  nextLimit = 6,
}: {
  firstLimit?: number;
  nextLimit?: number;
}) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useEpigrams({ firstLimit, nextLimit });

  if (isLoading) return <div>불러오는 중...</div>;
  if (isError) return <div>에러 발생!</div>;

  const epigrams = data?.pages.flatMap((page) => page.list) ?? [];

  return (
    <div className='space-y-4'>
      <h1>피드</h1>
      {epigrams.map((epigram: Epigram) => (
        <EpigramCard key={epigram.id} data={epigram} />
      ))}
      {hasNextPage && (
        <div className='flex justify-center mt-4'>
          <Button
            variant='outline'
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? '로딩중...' : '에피그램 더보기'}
          </Button>
        </div>
      )}
    </div>
  );
}
