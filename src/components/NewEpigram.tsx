'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Epigram, EpigramResponse } from '@/types/today';
import EpigramCard from './EpigramCard';
import { Button } from './ui/button';

export default function NewEpigram({ title }: { title: string }) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery<EpigramResponse>({
    queryKey: ['epigrams'],
    queryFn: async ({ pageParam }) => {
      const limit = pageParam ? 5 : 3; // 첫 페이지는 3개, 이후는 5개
      const cursor = pageParam ? `&cursor=${pageParam}` : '';
      const { data } = await axios.get<EpigramResponse>(
        `https://fe-project-epigram-api.vercel.app/16-10/epigrams?limit=${limit}${cursor}`
      );
      return data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
    initialPageParam: null,
  });

  if (isLoading) return <div>불러오는 중...</div>;
  if (isError) return <div>에러 발생!</div>;

  const epigrams = data?.pages.flatMap((page) => page.list) ?? [];

  return (
    <div className='space-y-4'>
      <h1>{title}</h1>
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
