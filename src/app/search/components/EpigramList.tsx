"use client";

import { useInfiniteQuery, InfiniteData } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSearchStore } from "@/stores/searchStore";
import { getSearchEpigram } from "@/lib/api";
import { EpigramSearchResponse } from "@/types/search";
import { highlightText } from "@/utils/highlight";

export default function EpigramList() {
  const { keyword } = useSearchStore();
  const router = useRouter();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery<
    EpigramSearchResponse, // TQueryFnData: API 반환 타입
    Error, // TError
    InfiniteData<EpigramSearchResponse>, // 최종 data 타입 (pages 포함)
    string[], // TQueryKey
    number // TPageParam
  >({
    queryKey: ["epigrams", keyword],
    queryFn: ({ pageParam = 0 }) =>
      getSearchEpigram({ limit: 10, cursor: pageParam, keyword }),
    getNextPageParam: (lastPage) =>
      lastPage.nextCursor !== null ? lastPage.nextCursor : undefined,
    initialPageParam: 0,
    enabled: !!keyword,
  });

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // IntersectionObserver로 무한 스크롤
  useEffect(() => {
    if (!hasNextPage || !loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const ent = entries[0];
        if (ent.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root: null, rootMargin: "200px", threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 로딩 / 에러 처리
  if (isFetchingNextPage || isLoading) return <p>로딩 중...</p>;
  if (isError) return <p>에러 발생</p>;

  return (
    <div className='w-full max-w-2xl mx-auto space-y-6 md:text-xl text-base'>
      {data?.pages.map((page) =>
        page.list.map((epigram) => (
          <div
            key={epigram.id}
            onClick={() => router.push(`/detail/${epigram.id}`)}
            className='border-b p-4 cursor-pointer hover:bg-gray-50'
          >
            {/* 에피그램 */}
            <p className='font-iropke text-black-600 font-normal leading-relaxed'>
              {highlightText(epigram.content, keyword)}
            </p>

            {/* 작가 */}
            <p className='font-iropke my-5 font-normal text-blue-400'>
              - {highlightText(epigram.author, keyword)} -
            </p>

            {/* 태그 먼저 */}
            <div className='flex justify-end'>
              {Array.isArray(epigram.tags) && epigram.tags.length > 0 && (
                <div className='flex flex-wrap gap-2 mb-2'>
                  {epigram.tags.map((tag, idx) => {
                    // 태그가 string이 아닐 수도 있는 API 대비
                    const label =
                      typeof tag === "string"
                        ? tag
                        : typeof (tag as any)?.name === "string"
                          ? (tag as any).name
                          : String(tag ?? "");

                    return (
                      <span key={idx} className='text-blue-400'>
                        #{highlightText(label, keyword)}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))
      )}

      {/* 무한 스크롤 트리거 */}
      <div ref={loadMoreRef} className='h-10 flex items-center justify-center'>
        {isFetchingNextPage && <p className='text-gray-400'>loading...</p>}
      </div>
    </div>
  );
}
