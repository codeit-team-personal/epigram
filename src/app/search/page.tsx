import { Search } from "lucide-react";

function SearchInput() {
  return (
    <div className='relative w-full lg:h-[80px] md:h-[60px] h-[52px] my-10'>
      <input
        type='text'
        className='w-full h-full lg:text-2xl md:text-xl  border-b-3 border-blue-800 py-2 pr-10 focus:outline-none caret-gray-200'
      />
      <Search className='absolute right-0 top-1/2 -translate-y-1/2 lg:size-7 size-5 text-blue-800' />
    </div>
  );
}

export default function Home() {
  return (
    <div className='flex min-h-screen justify-center bg-white'>
      <div className='flex flex-col lg:w-[640px] md:w-[384px] w-[360px]'>
        <SearchInput />
        <div>
          <div>
            <span>최근 검색어</span>
            <span>모두 지우기</span>
          </div>
          <div>
            <span>꿈</span>
            <span>기분</span>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
}
