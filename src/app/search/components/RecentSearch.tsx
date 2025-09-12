"use client";

import { useSearchStore } from "@/stores/searchStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export default function RecentSearch() {
  const { recentSearches, setKeyword, addRecentSearch, clearRecentSearches } =
    useSearchStore();
  const router = useRouter();

  // 검색어 없으면 보여주지 않음
  if (recentSearches.length === 0) return null;

  const handleClick = (keyword: string) => {
    setKeyword(keyword);
    addRecentSearch(keyword);
    router.push(`/search?keyword=${encodeURIComponent(keyword)}`);
  };

  return (
    <div className='flex flex-col'>
      <div className='flex items-center justify-between mb-10'>
        <h2 className='lg:text-2xl md:text-xl text-base text-black-700 font-medium'>
          최근 검색어
        </h2>
        <Button
          variant='link'
          className='font-semibold lg:text-base md:text-sm text-[12px] text-state hover:text-red-500 hover:no-underline p-0 h-auto cursor-pointer'
          onClick={clearRecentSearches}
        >
          모두 지우기
        </Button>
      </div>
      <div className='flex flex-wrap md:gap-4 gap-2'>
        {recentSearches.map((keyword) => (
          <Badge
            key={keyword}
            variant='secondary'
            onClick={() => handleClick(keyword)}
            className='lg:text-2xl md:text-xl text-base font-normal text-black-300 rounded-2xl px-3 py-1 cursor-pointer bg-background hover:bg-gray-200'
          >
            {keyword}
          </Badge>
        ))}
      </div>
    </div>
  );
}
