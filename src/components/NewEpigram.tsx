"use client";

import { Epigram } from "@/types/today";
import EpigramCard from "@/components/EpigramCard";
import { Button } from "./ui/button";
import { useEpigrams } from "@/hooks/useEpigrams";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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

  if (isLoading)
    return (
      <div>
        <div className='my-30 '>
          <h1 className='text-common mb-10'>{title}</h1>
          <div className='mb-6'>
            <Skeleton className='h-[130px] w-full rounded-xl' />
            <div className='flex items-center justify-end mt-4'>
              <Skeleton className='h-5 w-40 ' />
            </div>
          </div>
          <div className='mb-6'>
            <Skeleton className='h-[130px] w-full rounded-xl' />
            <div className='flex items-center justify-end mt-4'>
              <Skeleton className='h-5 w-40 ' />
            </div>
          </div>
          <div className='mb-6'>
            <Skeleton className='h-[130px] w-full rounded-xl' />
            <div className='flex items-center justify-end mt-4'>
              <Skeleton className='h-5 w-40 ' />
            </div>
          </div>
          <Skeleton className='h-15 w-70 mx-auto rounded-full' />
        </div>
      </div>
    );
  if (isError)
    return (
      <div>
        <div className='my-30 '>
          <h1 className='text-common mb-10'>{title}</h1>
          <div className='mb-6'>
            <Skeleton className='h-[130px] w-full rounded-xl' />
            <div className='flex items-center justify-end mt-4'>
              <Skeleton className='h-5 w-40 ' />
            </div>
          </div>
          <div className='mb-6'>
            <Skeleton className='h-[130px] w-full rounded-xl' />
            <div className='flex items-center justify-end mt-4'>
              <Skeleton className='h-5 w-40 ' />
            </div>
          </div>
          <div className='mb-6'>
            <Skeleton className='h-[130px] w-full rounded-xl' />
            <div className='flex items-center justify-end mt-4'>
              <Skeleton className='h-5 w-40 ' />
            </div>
          </div>
          <Skeleton className='h-15 w-70 mx-auto rounded-full' />
        </div>
      </div>
    );

  const epigrams = data?.pages.flatMap((page) => page.list) ?? [];

  return (
    <div className='mb-30'>
      <h1 className='text-common mb-10'>{title}</h1>
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
            <Plus className='text-blue-500 size-6' />
            <div className='text-blue-500 text-xl  '>
              {isFetchingNextPage ? "에피그램 로딩중" : "에피그램 더보기"}
            </div>
          </Button>
        </div>
      )}
    </div>
  );
}
