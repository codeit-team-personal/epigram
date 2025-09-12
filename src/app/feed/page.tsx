"use client";

import { Epigram } from "@/types/today";
import EpigramCard from "@/components/EpigramCard";
import { Button } from "@/components/ui/button";
import { useEpigrams } from "@/hooks/useEpigrams";
import { useRouter, useSearchParams } from "next/navigation";
import { FloatingButtonsGroup } from "@/components/FloatingButtonsGroup";
import { Grid, List } from "lucide-react";
import { useState } from "react";

export default function Feed() {
  const searchParams = useSearchParams();
  const firstLimit = Number(searchParams.get("firstLimit") ?? 6);
  const nextLimit = Number(searchParams.get("nextLimit") ?? 6);
  const router = useRouter();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useEpigrams({ firstLimit, nextLimit });

  const [isGrid, setIsGrid] = useState(false);

  const toggleLayout = () => setIsGrid(!isGrid);

  if (isLoading) return <div>불러오는 중...</div>;
  if (isError) return <div>에러 발생!</div>;

  const epigrams = data?.pages.flatMap((page) => page.list) ?? [];

  return (
    <div className='lg:w-[1200px] md:w-[600px] w-[360px] mx-auto'>
      <div className='lg:my-20 my-10 space-y-4'>
        <div className='flex justify-between'>
          <h1 className='my-10 text-black-600 font-semibold'>피드</h1>
          {/* 버튼: 모바일에서만 보임 */}
          <button
            onClick={toggleLayout}
            className='p-2 block max-[639px]:block sm:hidden'
          >
            {isGrid ? <List size={20} /> : <Grid size={20} />}
          </button>
        </div>

        <div
          className={
            // PC/태블릿: 2열, 모바일: isGrid 따라 1열/2열
            isGrid
              ? "grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-2"
              : "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2"
          }
        >
          {epigrams.map((epigram: Epigram) => (
            <div
              key={epigram.id}
              className='cursor-pointer'
              onClick={() => router.push(`/detail/${epigram.id}`)}
            >
              <EpigramCard data={epigram} />
            </div>
          ))}
        </div>

        {hasNextPage && (
          <div className='flex justify-center mt-4'>
            <Button
              className='flex items-center gap-2 rounded-full border border-line-200 bg-transparent px-4 py-2 lg:text-xl text-sm text-blue-500 hover:bg-gray-50 lg:w-[238px] lg:h-[56px] w-[153px] h-[48px]'
              variant='outline'
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              <span className=''>+</span>
              <span>
                {isFetchingNextPage ? "로딩중..." : "에피그램 더보기"}
              </span>
            </Button>
          </div>
        )}
      </div>
      <FloatingButtonsGroup />
    </div>
  );
}
