"use client";

import { Epigram } from "@/types/today";

export default function EpigramCard({ data }: { data: Epigram }) {
  return (
    <div className='font-iropke lg:text-2xl md:text-base text-sm text-black-600 lg:max-h-[407px] md:max-h-[304px]  max-h-[242px]'>
      <div className='p-6 rounded-xl shadow-sm border border-line-100 bg-card relative overflow-hidden '>
        {/* 줄무늬 배경 */}
        <div
          className='absolute inset-0 bg-[repeating-linear-gradient(to_bottom,white_0px,white_24px,#f2f2f2_25px)]'
          aria-hidden='true'
        />
        {/* 콘텐츠 */}
        <div className='relative flex flex-col justify-between '>
          {/* 본문 */}
          <p className='leading-relaxed md:line-clamp-4 line-clamp-3'>
            {data.content}
          </p>
          {/* 저자 */}
          <p className='flex items-center justify-end gap-1 lg:mt-3 mt-1 text-right text-blue-400'>
            <span className='shrink-0'>-</span>
            <span className='truncate'>{data.author}</span>
            <span className='shrink-0'>-</span>
          </p>
        </div>
      </div>

      {/* 태그 */}
      <div className='text-right text-blue-400 mb-4 mt-2'>
        <div className='inline-flex flex-wrap gap-2 justify-end'>
          {data.tags?.map((tag) => (
            <span
              key={tag.id}
              className='px-2 py-1 rounded bg-blue-50 text-blue-500'
            >
              #{tag.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
