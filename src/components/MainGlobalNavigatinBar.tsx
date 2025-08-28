import Image from 'next/image';
import { Menu } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

function Logo() {
  return (
    <div className='flex items-center'>
      <div className='relative lg:size-9 size-6 mr-3'>
        <Image src='/images/logo.png' alt='logo' fill />
      </div>
      <span className='lg:text-2xl text-xl font-bold lg:mr-10 mr-7'>
        Epigram
      </span>
    </div>
  );
}

function DesktopNav() {
  return (
    <nav className='hidden md:block lg:block [&>span]:text-black-600 [&>span]:text-sm [&>span]:lg:text-base'>
      <span className='lg:mr-10 mr-7 cursor-pointer hover:text-gray-400'>
        피드
      </span>
      <span className='cursor-pointer hover:text-gray-400'>검색</span>
    </nav>
  );
}

function MobileMenu() {
  return (
    <Popover>
      <PopoverTrigger className='lg:hidden md:hidden text-gray-200 mr-5'>
        <Menu />
      </PopoverTrigger>
      <PopoverContent className='w-30 text-center [&>div]:cursor-pointer [&>div]:hover:text-gray-400'>
        <div className='pb-3'>피드</div>
        <div>검색</div>
      </PopoverContent>
    </Popover>
  );
}

function UserProfile() {
  return (
    <div className='flex items-center'>
      <div className='relative size-6 mr-2'>
        <Image src='/images/user.png' alt='user' fill />
      </div>
      <span className='text-gray-300 text-sm'>최재이</span>
    </div>
  );
}

export default function MainGlobalNavigationBar() {
  return (
    <header className='max-w-[1920px] lg:h-[80px] md:h-[60px] h-[52px] flex items-center justify-between lg:px-50 md:px-10 px-5 bg-white'>
      <div className='flex items-center'>
        <MobileMenu />
        <Logo />
        <DesktopNav />
      </div>
      <UserProfile />
    </header>
  );
}
