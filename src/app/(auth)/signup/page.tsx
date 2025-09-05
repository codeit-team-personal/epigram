import OauthLogin from "../components/OauthLogin";
import Logo from "@/components/Logo";
import RegisterForm from "../components/RegisterForm";

export default function Home() {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='flex flex-col justify-between lg:w-[640px] lg:h-[960px] md:w-[384px] md:h-[774px] w-[312px] h-[684px]'>
        <div className='flex flex-col lg:gap-5 md:gap-4 gap-3'>
          <div className='mx-auto lg:mb-20 md:mb-15 mb-10'>
            <Logo />
          </div>
          <RegisterForm />
        </div>
        <div>
          <span
            className="lg:text-xl text-[12px] text-center text-blue-400 block relative before:content-[''] before:absolute 
          before:h-[1px] before:w-[30%] before:bg-blue-400 before:left-0 before:top-[50%] after:content-[''] after:absolute 
          after:h-[1px] after:w-[30%] after:bg-blue-400 after:right-0 after:top-[50%] mb-10"
          >
            SNS 계정으로 간편 가입하기
          </span>

          <OauthLogin />
        </div>
      </div>
    </div>
  );
}
