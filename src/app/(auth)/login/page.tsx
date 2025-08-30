import Link from "next/link";
import { Button } from "@/components/ui/button";
import { InputField } from "../components/InputField";
import SNSOauth from "../components/SNSOauth";
import Logo from "@/components/Logo";

export default function Home() {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div
        className='flex flex-col justify-between lg:w-[640px] lg:h-[568px] md:w-[384px] md:h-[456px] w-[312px] h-[436px]
      [&>div>input]:lg:h-[64px] [&>div>input]:h-[44px] [&>div>input]:lg:text-xl [&>div>input]:md:text-[16px] [&>div>input]:text-[16px] [&>div>input]:placeholder:text-blue-400 [&>div>input]:bg-blue-200 [&>div>input]:lg:mt-4 [&>div>input]:mt-2
      '
      >
        <div className='flex flex-col'>
          <div className='mx-auto mb-12'>
            <Logo />
          </div>

          <InputField type='email' placeholder='이메일' />
          <InputField type='password' placeholder='비밀번호' />
          <Button
            variant='disabled'
            className='lg:text-xl w-full lg:h-[64px] h-[44px] my-8'
          >
            로그인
          </Button>

          <span className='lg:text-xl text-right text-blue-400'>
            회원이 아니신가요?{" "}
            <Link className='text-black-500 underline' href='/signup'>
              가입하기
            </Link>
          </span>
        </div>
        <div>
          <span
            className="lg:text-xl text-[12px] text-center block relative text-blue-400 
            before:content-[''] before:absolute before:h-[1px] before:w-[30%] before:bg-blue-400 before:left-0 before:top-[50%] after:content-[''] after:absolute 
          after:h-[1px] after:w-[30%] after:bg-blue-400 after:right-0 after:top-[50%] mb-10"
          >
            SNS 계정으로 로그인하기
          </span>

          <SNSOauth />
        </div>
      </div>
    </div>
  );
}
