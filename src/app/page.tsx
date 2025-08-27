import { ChevronsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function LandingStart() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center relative'>
      {/* 줄무늬 배경 */}
      <div className='absolute inset-0 bg-[linear-gradient(to_bottom,#f5f5f5_1px,transparent_1px)] bg-[length:100%_32px]' />

      <div className='flex flex-col border w-[415px] text-center z-10'>
        <h1 className='lg:text-[40px] md:text-[32px] text-2xl font-medium text-neutral-800 lg:mb-12 md:mb-7 mb-3'>
          나만 갖고 있기엔
          <br />
          아까운 글이 있지 않나요?
        </h1>
        <h3 className='md:text-xl text-sm  text-neutral-500 lg:mb-15 md:mb-10 mb-5'>
          다른 사람들과 감정을 공유해 보세요.
        </h3>
        <Button className='lg:w-[286px] lg:h-[64px] w-[112px] h-[48px] mx-auto'>
          시작하기
        </Button>
      </div>
      <div className='flex flex-col text-neutral-500 cursor-pointer absolute bottom-30'>
        <span className='sm:text-[16px] text-[12px]'>더 알아보기</span>
        <span className='mx-auto'>
          <ChevronsDown className='size-6' />
        </span>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <LandingStart />
    </>
  );
}
