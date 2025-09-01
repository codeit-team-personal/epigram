import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InputField } from "../components/InputField";
import SNSOauth from "../components/SNSOauth";
import Logo from "@/components/Logo";

export default function Home() {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='flex flex-col justify-between lg:w-[640px] lg:h-[960px] md:w-[384px] md:h-[774px] w-[312px] h-[684px]'>
        <div className='flex flex-col lg:gap-5 md:gap-4 gap-3'>
          <div className='mx-auto lg:mb-20 md:mb-15 mb-10'>
            <Logo />
          </div>
          <div>
            <Label
              className='lg:text-xl md:text-[16px] text-[16px] mb-5 text-blue-900'
              htmlFor='email'
            >
              이메일
            </Label>

            <InputField
              className='lg:h-[64px] h-[44px] lg:text-xl md:text-[16px] text-[16px] placeholder:text-blue-400 bg-blue-200 border-red-500 mt-2'
              type='email'
              id='email'
              placeholder='이메일'
            />
          </div>
          <div>
            <Label
              className='lg:text-xl md:text-[16px] text-[16px] mb-5 text-blue-900'
              htmlFor='password'
            >
              비밀번호
            </Label>

            <InputField
              className='lg:h-[64px] h-[44px] lg:text-xl md:text-[16px] text-[16px] placeholder:text-blue-400 bg-blue-200 border-red-500 mt-2'
              type='password'
              id='password'
              placeholder='비밀번호'
            />

            <InputField
              className='lg:h-[64px] h-[44px] lg:text-xl md:text-[16px] text-[16px] placeholder:text-blue-400 bg-blue-200 border-red-500 mt-2'
              type='password'
              placeholder='비밀번호 확인'
            />
          </div>
          <div>
            <Label
              className='lg:text-xl md:text-[16px] text-[16px] mb-5 text-blue-900'
              htmlFor='nickname'
            >
              닉네임
            </Label>

            <InputField
              className='lg:h-[64px] h-[44px] lg:text-xl md:text-[16px] text-[16px] placeholder:text-blue-400 bg-blue-200 border-red-500 mt-2'
              type='text'
              id='nickname'
              placeholder='닉네임'
            />
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

          <SNSOauth />
        </div>
      </div>
    </div>
  );
}
