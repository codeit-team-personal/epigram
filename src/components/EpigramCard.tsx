'use client';

import { Epigram } from '@/types/today';

export default function EpigramCard({ data }: { data: Epigram }) {
  return (
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
          <p className='leading-relaxed'>{data.content}</p>

          {/* 저자 */}
          <p className='mt-3 text-right text-blue-400'>- {data.author} -</p>
        </div>
      </div>

      {/* 태그 */}
      <div className='text-right text-blue-400 mb-4 mt-2'>
        {data.tags?.map((tag) => (
          <span key={tag.id} className='m-2'>
            #{tag.name}
          </span>
        ))}
      </div>
    </div>
  );
}
