'use client';

import { useQuery } from '@tanstack/react-query';
import { Epigram } from '@/types/today';
import { getTodayEpigram } from '@/lib/api';
import EpigramCard from './EpigramCard';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export default function TodayEpigram({ title }: { title: string }) {
  const { data, isLoading, isError } = useQuery<Epigram>({
    queryKey: ['today-epigram'],
    queryFn: getTodayEpigram,
  });

  // 로딩 상태
  if (isLoading || isError)
    return (
      <div className='my-16 md:my-24 lg:my-30 mx-auto w-[312px] md:w-[384px] lg:w-[640px]'>
        <h1 className='text-black-600 text-lg md:text-xl lg:text-2xl font-semibold mb-6 md:mb-8 lg:mb-10'>
          {isError ? '에러가 발생' : title}
        </h1>
        <div className='w-[312px] md:w-[384px] lg:w-[640px] mx-auto'>
          <Skeleton className='h-[100px] md:h-[120px] lg:h-[130px] w-full rounded-xl' />
          <div className='flex items-center justify-end mt-3 md:mt-4'>
            <Skeleton className='h-4 md:h-5 w-32 md:w-40' />
          </div>
        </div>
      </div>
    );

  if (!data)
    // 데이터 없을 때
    return (
      <div className='my-16 md:my-24 lg:my-30 mx-auto w-[312px] md:w-[384px] lg:w-[640px]'>
        <h1 className='text-black-600 text-lg md:text-xl lg:text-2xl font-semibold mb-6 md:mb-8 lg:mb-10'>
          {title}
        </h1>
        <div className='w-[312px] md:w-[384px] lg:w-[640px] mx-auto'>
          <div className='font-iropke text-lg md:text-xl lg:text-2xl'>
            <div className='p-4 md:p-5 lg:p-6 rounded-xl shadow-sm border border-line-100 bg-card relative overflow-hidden'>
              {/* 줄무늬 배경 */}
              <div
                className='absolute inset-0 bg-[repeating-linear-gradient(to_bottom,white_0px,white_24px,#f2f2f2_25px)]'
                aria-hidden='true'
              />
              {/* 콘텐츠 */}
              <div className='relative'>
                {/* 본문 */}
                <p className='leading-relaxed'>우리 순복이 너무 귀엽다</p>
                {/* 저자 */}
                <p className='mt-2 md:mt-3 text-right text-blue-400'>
                  - 최재이 -
                </p>
              </div>
            </div>
            {/* 태그 */}
            <div className='text-right text-blue-400 mb-3 md:mb-4 mt-1 md:mt-2'>
              #내강아지
            </div>
          </div>
        </div>
      </div>
    );

  // 데이터 있을 때
  return (
    <div className='my-16 md:my-24 lg:my-30 mx-auto w-[312px] md:w-[384px] lg:w-[640px]'>
      <h1 className='text-black-600 text-lg md:text-xl lg:text-2xl font-semibold mb-6 md:mb-8 lg:mb-10'>
        {title}
      </h1>
      <div className='w-[312px] md:w-[384px] lg:w-[640px] mx-auto'>
        <Link key={data.id} href={`/detail/${data.id}`}>
          <EpigramCard key={data.id} data={data} />
        </Link>
      </div>
    </div>
  );
}
