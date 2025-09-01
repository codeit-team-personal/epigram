'use client';

import { useQuery } from '@tanstack/react-query';
import { Epigram } from '@/types/today';
import { getEpigram } from '@/lib/api';

export default function EpigramCard({ data }: { data: Epigram }) {
  return (
    <div>
      <div className='p-4 rounded-md shadow bg-white'>
        <p className='text-gray-700'>{data.content}</p>
        <p className='text-right mt-2 text-sm text-gray-500'>
          - {data.author} -
        </p>
        <div className='mt-2 flex gap-2 text-blue-500 text-xs flex-wrap'>
          {data.tags?.map((tag) => (
            <span key={tag.id}>#{tag.name}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
