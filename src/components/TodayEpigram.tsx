'use client';

import { useQuery } from '@tanstack/react-query';
import { Epigram } from '@/types/today';
import { getTodayEpigram } from '@/lib/api';
import EpigramCard from './EpigramCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function TodayEpigram({ title }: { title: string }) {
  const { data, isLoading, isError } = useQuery<Epigram>({
    queryKey: ['today-epigram'],
    queryFn: getTodayEpigram,
  });

  if (isLoading)
    return (
      <div className='my-30 '>
        <h1 className='text-common mb-10'>{title}</h1>
        <Skeleton className='h-[130px] w-full rounded-xl' />
        <div className='flex items-center justify-end mt-4'>
          <Skeleton className='h-5 w-40 ' />
        </div>
      </div>
    );
  if (isError)
    return (
      <div className='my-30 '>
        <h1 className='text-common mb-10'>{title}</h1>
        <Skeleton className='h-[130px] w-full rounded-xl' />
        <div className='flex items-center justify-end mt-4'>
          <Skeleton className='h-5 w-40 ' />
        </div>
      </div>
    );
  if (!data)
    return (
      <div className='my-30 '>
        <h1 className='text-common mb-10'>{title}</h1>
        <div className='font-iropke text-2xl'>
          <div className='p-6 rounded-xl shadow-sm border border-line-100 bg-card relative overflow-hidden'>
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
              <p className='mt-3 text-right text-blue-400'>- 최재이 -</p>
            </div>
          </div>

          {/* 태그 */}
          <div className='text-right text-blue-400 mb-4 mt-2'>#내강아지</div>
        </div>
      </div>
    );

  return (
    <div className='my-30'>
      <h1 className='text-common mb-10'>{title}</h1>
      <EpigramCard key={data.id} data={data} />
    </div>
  );
}
