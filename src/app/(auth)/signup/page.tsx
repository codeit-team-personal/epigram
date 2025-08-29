import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InputField } from "../components/InputField";

function Logo() {
  return (
    <Link className='mx-auto lg:mb-20 md:mb-15 mb-10' href='/'>
      <div className='flex gap-3 items-center'>
        <div className='relative size-9'>
          <Image src={"/images/logo.png"} fill alt='logo' />
        </div>

        <div className='relative w-[110px] h-[28px]'>
          <Image src={"/images/logo_text.png"} fill alt='logo' />
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div
        className='flex flex-col justify-between lg:w-[640px] lg:h-[960px] md:w-[384px] md:h-[774px] w-[312px] h-[684px]

      [&>div>div>label]:lg:text-xl [&>div>div>label]:md:text-[16px] [&>div>div>label]:text-[16px] [&>div>div>label]:mb-5 [&>div>div>label]:text-blue-900

      [&>div>div>input]:lg:h-[64px] [&>div>div>input]:h-[44px] [&>div>div>input]:lg:text-xl [&>div>div>input]:md:text-[16px] [&>div>div>input]:text-[16px] [&>div>div>input]:placeholder:text-blue-400 [&>div>div>input]:bg-blue-200 [&>div>div>input]:border-red-500 [&>div>div>input]:mt-2
      '
      >
        <div className='flex flex-col lg:gap-5 md:gap-4 gap-3'>
          <Logo />
          <div>
            <Label htmlFor='email'>이메일</Label>
            <InputField type='email' id='email' placeholder='이메일' />
          </div>
          <div>
            <Label htmlFor='password'>비밀번호</Label>
            <InputField type='password' id='password' placeholder='비밀번호' />
            <InputField type='password' placeholder='비밀번호 확인' />
          </div>
          <div>
            <Label htmlFor='nickname'>닉네임</Label>
            <InputField type='text' id='nickname' placeholder='닉네임' />
          </div>

          <Button
            variant='disabled'
            className='lg:text-xl w-full lg:h-[64px] h-[44px] my-5'
          >
            가입하기
          </Button>
        </div>
        <div>
          <span
            className="lg:text-xl text-[12px] text-center text-blue-400 block relative before:content-[''] before:absolute 
          before:h-[1px] before:w-[30%] before:bg-blue-400 before:left-0 before:top-[50%] after:content-[''] after:absolute 
          after:h-[1px] after:w-[30%] after:bg-blue-400 after:right-0 after:top-[50%] mb-10"
          >
            SNS 계정으로 간편 가입하기
          </span>
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
        </div>
      </div>
    </div>
  );
}
