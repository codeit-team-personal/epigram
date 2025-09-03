"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRegisterForm } from "@/hooks/useRegisterForm";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterForm() {
  const { login } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useRegisterForm();

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      await login(data.email, data.password);
      router.push("/");
    } catch (err) {
      alert("로그인 실패");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Email */}
      <div>
        <Label
          className='lg:text-xl md:text-[16px] text-[16px] mb-4 text-blue-900'
          htmlFor='email'
        >
          이메일
        </Label>
        <Input
          type='email'
          placeholder='이메일'
          {...register("email")}
          className={`lg:h-[64px] h-[44px] lg:text-xl md:text-[16px] text-[16px] placeholder:text-blue-400 bg-blue-200 mt-2 ${
            errors.email
              ? "border-red-500 focus-visible:ring-red-500"
              : "border-none"
          }`}
        />
        {errors.email && (
          <p className='text-red-500 lg:text-[16px] text-[13px] mt-1'>
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <Label
          className='lg:text-xl md:text-[16px] text-[16px] my-4 text-blue-900'
          htmlFor='password'
        >
          비밀번호
        </Label>

        <Input
          type='password'
          placeholder='비밀번호'
          {...register("password")}
          className={`lg:h-[64px] h-[44px] lg:text-xl md:text-[16px] text-[16px] placeholder:text-blue-400 bg-blue-200 mt-2 ${
            errors.password
              ? "border-red-500 focus-visible:ring-red-500"
              : "border-none"
          }`}
        />
        {errors.password && (
          <p className='text-red-500 lg:text-[16px] text-[13px] mt-1'>
            {errors.password.message}
          </p>
        )}

        <Input
          type='password'
          placeholder='비밀번호 확인'
          {...register("confirmPassword")}
          className={`lg:h-[64px] h-[44px] lg:text-xl md:text-[16px] text-[16px] placeholder:text-blue-400 bg-blue-200 mt-2 ${
            errors.confirmPassword
              ? "border-red-500 focus-visible:ring-red-500"
              : "border-none"
          }`}
        />
        {errors.confirmPassword && (
          <p className='text-red-500 lg:text-[16px] text-[13px] mt-1'>
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div>
        <Label
          className='lg:text-xl md:text-[16px] text-[16px] my-4 text-blue-900'
          htmlFor='nickname'
        >
          닉네임
        </Label>
        <Input
          type='text'
          placeholder='닉네임'
          {...register("nickname")}
          className={`lg:h-[64px] h-[44px] lg:text-xl md:text-[16px] text-[16px] placeholder:text-blue-400 bg-blue-200 mt-2 ${
            errors.nickname
              ? "border-red-500 focus-visible:ring-red-500"
              : "border-none"
          }`}
        />
        {errors.nickname && (
          <p className='text-red-500 lg:text-[16px] text-[13px] mt-1'>
            {errors.nickname.message}
          </p>
        )}
      </div>

      <Button
        disabled={isSubmitting || !isValid}
        type='submit'
        className='lg:text-xl w-full lg:h-[64px] h-[44px] my-8 cursor-pointer'
      >
        {isSubmitting ? "가입 중..." : "가입하기"}
      </Button>
    </form>
  );
}
