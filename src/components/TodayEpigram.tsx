'use client';

import { useQuery } from '@tanstack/react-query';
import { Epigram } from '@/types/today';
import { getTodayEpigram } from '@/lib/api';
import EpigramCard from './EpigramCard';

export default function TodayEpigram({ title }: { title: string }) {
  const { data, isLoading, isError } = useQuery<Epigram>({
    queryKey: ['today-epigram'],
    queryFn: getTodayEpigram,
  });

  if (isLoading) return <div>불러오는 중...</div>;
  if (isError) return <div>에러가 발생했습니다.</div>;
  if (!data)
    return (
      <div>
        <h1 className='font-bold text-lg mb-2'>{title}</h1>
        <div className='p-4 rounded-md shadow bg-white'>데이터 없음</div>
      </div>
    );

  return (
    <div>
      <h1 className='font-bold text-lg mb-2'>{title}</h1>
      <EpigramCard key={data.id} data={data} />
    </div>
  );
}
