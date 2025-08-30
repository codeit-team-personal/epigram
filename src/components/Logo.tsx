import Image from "next/image";
import Link from "next/link";

export default function Logo({ type = "normal" }: { type?: string }) {
  if (type !== "normal") {
    return (
      <Link href='/' aria-label='랜딩 페이지로 이동'>
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
    <Link href='/' aria-label='랜딩 페이지로 이동'>
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
