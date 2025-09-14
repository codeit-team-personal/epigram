'use client';

import { Epigram } from '@/types/today';
import EpigramCard from '@/components/EpigramCard';
import { Button } from './ui/button';
import { useEpigrams } from '@/hooks/useEpigrams';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function NewEpigram({
  title,
  firstLimit = 3,
  nextLimit = 5,
}: {
  title: string;
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

  if (isLoading || isError) {
    return (
      <div className='my-16 md:my-24 lg:my-30 mx-auto w-[312px] md:w-[384px] lg:w-[640px]'>
        <h1 className='text-black-600 text-lg md:text-xl lg:text-2xl font-semibold mb-6 md:mb-8 lg:mb-10'>
          {isError ? '에러가 발생' : title}
        </h1>

        {/* 카드 3개 skeleton */}
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className='mb-6'>
            {/* EpigramCard 영역에 맞춰 반응형 */}
            <Skeleton className='w-full h-[120px] md:h-[140px] lg:h-[160px] rounded-xl' />
            <div className='flex items-center justify-end mt-4'>
              <Skeleton className='h-4 md:h-5 w-24 md:w-32 lg:w-40' />
            </div>
          </div>
        ))}

        {/* 더보기 버튼 skeleton */}
        <Skeleton className='h-10 md:h-12 w-40 md:w-56 lg:w-72 mx-auto rounded-full' />
      </div>
    );
  }

  const epigrams = data?.pages.flatMap((page) => page.list) ?? [];

  return (
    <div className='my-16 md:my-24 lg:my-30 mx-auto w-[312px] md:w-[384px] lg:w-[640px]'>
      <h1 className='text-black-600 text-lg md:text-xl lg:text-2xl font-semibold mb-6 md:mb-8 lg:mb-10'>
        {title}
      </h1>
      <div className='flex flex-col justify-center'>
        {epigrams.map((epigram: Epigram) => (
          <Link key={epigram.id} href={`/detail/${epigram.id}`}>
            <EpigramCard key={epigram.id} data={epigram} />
          </Link>
        ))}
      </div>

      {hasNextPage && (
        <div className='flex justify-center mt-4 cursor-pointer'>
          <Button
            variant='plus'
            size='plus'
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            <Plus className='text-blue-500 size-4 lg:size-6' />
            <div className='text-blue-500 text-sm lg:text-xl  '>
              {isFetchingNextPage ? '에피그램 로딩중' : '에피그램 더보기'}
            </div>
          </Button>
        </div>
      )}
    </div>
  );
}
