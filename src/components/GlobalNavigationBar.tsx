import Image from 'next/image';
import { User, Search } from 'lucide-react';

export default function GlobalNavigationBar() {
  return (
    <div className='max-w-[1920px] h-[80px] border flex items-center'>
      <div className='flex border px-20 justify-between items-center grow'>
        <span>
          <Search size={24} />
        </span>
        <div className='flex gap-3'>
          <Image src={'/images/logo.png'} width={36} height={36} alt='logo' />
          <span className='text-2xl'>Epigram</span>
        </div>
        <span>
          <User size={24} />
        </span>
      </div>
    </div>
  );
}
