import Image from 'next/image';
import { User, Search } from 'lucide-react';

export default function GlobalNavigationBar() {
  return (
    <div className='max-w-[1920px] lg:h-[80px] md:h-[60px] h-[52px] flex items-center'>
      <div className='flex lg:px-20 md:px-15 px-5 justify-between items-center grow'>
        <span>
          <Search className='lg:size-9 size-5' />
        </span>
        <div className='flex gap-3 items-center'>
          <div className='relative lg:size-9 size-6'>
            <Image src={'/images/logo.png'} fill alt='logo' />
          </div>

          <div className='relative lg:w-[110px] lg:h-[28px] w-[81px] h-[20px]'>
            <Image src={'/images/logo_text.png'} fill alt='logo' />
          </div>
        </div>
        <span>
          <User className='lg:size-9 size-5' />
        </span>
      </div>
    </div>
  );
}
