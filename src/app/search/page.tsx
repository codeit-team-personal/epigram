"use client";

import { Search } from "lucide-react";
import RecentSearch from "./components/RecentSearch";
import { useSearchStore } from "@/stores/searchStore";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import EpigramList from "./components/EpigramList";

export default function SearchPage() {
  const { keyword, setKeyword, addRecentSearch } = useSearchStore();
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const q = params.get("keyword");
    if (q) setKeyword(q);
  }, [params, setKeyword]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = new FormData(e.currentTarget).get("keyword") as string;
    if (!input) return;
    setKeyword(input);
    addRecentSearch(input);
    router.push(`/search?keyword=${encodeURIComponent(input)}`);
  };
  return (
    <div className='flex min-h-screen justify-center bg-white'>
      <div className='flex flex-col lg:w-[640px] md:w-[384px] w-[360px]'>
        <form
          onSubmit={handleSearch}
          className='relative w-full lg:h-[80px] md:h-[60px] h-[52px] my-10'
        >
          <input
            name='keyword'
            defaultValue={keyword}
            type='text'
            placeholder='검색어를 입력해 주세요'
            className='w-full h-full lg:text-2xl md:text-xl  border-b-3 border-blue-800 py-2 pr-10 focus:outline-none caret-gray-200'
          />
          <button type='submit' className='cursor-pointer'>
            <Search className='absolute right-0 top-1/2 -translate-y-1/2 lg:size-7 size-5 text-blue-800' />
          </button>
        </form>

        <div className='my-5'>
          <RecentSearch />
        </div>

        <EpigramList />

        <div></div>
      </div>
    </div>
  );
}
