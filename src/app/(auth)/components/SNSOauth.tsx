import Image from "next/image";
export default function SNSOauth() {
  return (
    <div className='flex gap-3 justify-center items-center'>
      <div className='lg:size-[60px] size-[40px] border rounded-xl flex justify-center items-center'>
        <div className='relative lg:size-[27px] size-[18px]'>
          <Image src={"/images/logo_google.png"} fill alt='logo' />
        </div>
      </div>
      <div className='lg:size-[60px] size-[40px] border rounded-xl flex justify-center items-center'>
        <div className='relative lg:w-[30px] w-[20px] lg:h-[27px] h-[18px]'>
          <Image src={"/images/logo_kakao.png"} fill alt='logo' />
        </div>
      </div>
    </div>
  );
}
