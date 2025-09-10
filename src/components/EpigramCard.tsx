"use client";

import { Epigram } from "@/types/today";

export default function EpigramCard({ data }: { data: Epigram }) {
  return (
    <div className='font-iropke lg:text-2xl md:text-base text-sm text-black-600 lg:w-[585px] lg:h-[307px] md:w-[294px] md:h-[214px] w-[312px] h-[172px]'>
      <div className='p-6 rounded-xl shadow-sm border border-line-100 bg-card relative overflow-hidden '>
        {/* 줄무늬 배경 */}
        <div
          className='absolute inset-0 bg-[repeating-linear-gradient(to_bottom,white_0px,white_24px,#f2f2f2_25px)]'
          aria-hidden='true'
        />
        {/* 콘텐츠 */}
        <div className='relative flex flex-col justify-between lg:h-[211px] md:h-[132px] h-[92px]'>
          {/* 본문 */}
          <p className='leading-relaxed lg:h-[160px] md:h-[150px] overflow-hidden md:line-clamp-4 line-clamp-3'>
            {data.content}
          </p>

          {/* 저자 */}
          <p className='lg:mt-3 mt-1 text-right text-blue-400'>
            - {data.author} -
          </p>
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
