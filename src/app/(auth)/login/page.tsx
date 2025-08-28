import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Home() {
  return(
    <div className='flex min-h-screen items-center justify-center bg-neutral-100'>
      <div className='flex flex-col justify-between lg:w-[640px] lg:h-[568px] md:w-[384px] md:h-[456px]'>
        
        <div className="flex flex-col gap-3">
          <Link className='mx-auto mb-10' href='/'>
            <div className='flex gap-3 items-center'>        
              <div className='relative size-9'>
                <Image src={'/images/logo.png'} fill alt='logo' />
              </div>

              <div className='relative w-[110px] h-[28px]'>
                <Image src={'/images/logo_text.png'} fill alt='logo' />
              </div>
            </div>
          </Link>
          <Input className='lg:h-[64px] h-[44px]' type='email' placeholder='이메일' />
          <Input className='lg:h-[64px] h-[44px]' type='password' placeholder='비밀번호'/>
          
          <Button className='lg:text-xl w-full lg:h-[64px] h-[44px] my-5'>
            로그인
          </Button>
          <span className='lg:text-xl text-right'>회원이 아니신가요? <span >가입하기</span></span>
        </div>
        <div>
          <span className="lg:text-xl text-[12px] text-center block relative before:content-[''] before:absolute 
          before:h-[1px] before:w-[30%] before:bg-black before:left-0 before:top-[50%] after:content-[''] after:absolute 
          after:h-[1px] after:w-[30%] after:bg-black after:right-0 after:top-[50%] mb-10" >SNS 계정으로 로그인하기</span>
          <div className="flex gap-3 justify-center items-center">
            <div className="lg:size-[60px] size-[40px] border rounded-xl flex justify-center items-center">
              <div className='relative lg:size-[27px] size-[18px]'>
                <Image src={'/images/logo_google.png'} fill alt='logo' />
              </div>
            </div>
            <div className="lg:size-[60px] size-[40px] border rounded-xl flex justify-center items-center">
              <div className='relative lg:w-[30px] w-[20px] lg:h-[27px] h-[18px]'>
                <Image src={'/images/logo_kakao.png'} fill alt='logo' />
              </div>
            </div>
          </div>
        </div>
        
        
      </div>
    </div>
  )
  
  ;
}
