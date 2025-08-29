import Image from "next/image";
import { User, Search } from "lucide-react";
import Link from "next/link";

function Logo({ isAuth = false }: { isAuth?: boolean }) {
  if (isAuth) {
    return (
      <Link className='mx-auto' href='/'>
        <div className='flex gap-3 items-center'>
          <div className='relative lg:size-6 size-4'>
            <Image src={"/images/logo.png"} fill alt='logo' />
          </div>
          <div className='relative lg:w-[90px] lg:h-[24px] w-[74px] h-[18px]'>
            <Image src={"/images/logo_text.png"} fill alt='logo' />
          </div>
        </div>
      </Link>
    );
  }
  return (
    <Link href='/'>
      <div className='flex gap-3 items-center'>
        <div className='relative lg:size-9 size-6'>
          <Image src={"/images/logo.png"} fill alt='logo' />
        </div>
        <div className='relative lg:w-[110px] lg:h-[28px] w-[81px] h-[20px]'>
          <Image src={"/images/logo_text.png"} fill alt='logo' />
        </div>
      </div>
    </Link>
  );
}

export default function GlobalNavigationBar({
  isAuth = false,
}: {
  isAuth?: boolean;
}) {
  return (
    <div className='max-w-[1920px] lg:h-[80px] md:h-[60px] h-[52px] flex items-center bg-white border'>
      <div className='flex lg:px-20 md:px-15 px-5 justify-between items-center grow'>
        {isAuth ? (
          <></>
        ) : (
          <Link href='/search'>
            <Search className='lg:size-9 size-5' />
          </Link>
        )}

        <Logo isAuth={isAuth} />

        {isAuth ? (
          <></>
        ) : (
          <Link href='/search'>
            <User className='lg:size-9 size-5' />
          </Link>
        )}
      </div>
    </div>
  );
}
