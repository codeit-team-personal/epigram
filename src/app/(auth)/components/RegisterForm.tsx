"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useRegisterForm } from "@/hooks/useRegisterForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser } from "@/lib/api";
import { AxiosError } from "axios";

export default function RegisterForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = useRegisterForm();

  const onSubmit = async (data: {
    email: string;
    password: string;
    passwordConfirmation: string;
    nickname: string;
  }) => {
    try {
      await registerUser(data);
      await login(data.email, data.password);
      router.push("/");
    } catch (err) {
      if (err instanceof AxiosError) {
        const status = err.response?.status;

        if (status === 400) {
          setError("email", {
            type: "manual",
            message: "이미 존재하는 이메일입니다.",
          });
        } else if (status === 500) {
          setError("nickname", {
            type: "manual",
            message: "이미 존재하는 닉네임입니다.",
          });
        } else {
          alert("알 수 없는 오류가 발생했습니다. 다시 시도해주세요.");
        }
      } else {
        // Axios 외의 다른 에러 (예: JS 런타임 에러)
        console.error("Unexpected Error:", err);
        alert("예상치 못한 오류가 발생했습니다.");
      }
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

        <div className='relative'>
          <Input
            type={showPassword ? "text" : "password"}
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
          <button
            tabIndex={-1}
            type='button'
            onClick={() => setShowPassword((prev) => !prev)}
            className='absolute lg:top-5 md:top-[10px] top-[9px] right-3 flex items-center text-gray-200 cursor-pointer'
          >
            {showPassword ? (
              <EyeOff className='size-6' />
            ) : (
              <Eye className='size-6' />
            )}
          </button>
        </div>
        <div className='relative'>
          <Input
            type={showConfirmPassword ? "text" : "password"}
            placeholder='비밀번호 확인'
            {...register("passwordConfirmation")}
            className={`lg:h-[64px] h-[44px] lg:text-xl md:text-[16px] text-[16px] placeholder:text-blue-400 bg-blue-200 mt-2 ${
              errors.passwordConfirmation
                ? "border-red-500 focus-visible:ring-red-500"
                : "border-none"
            }`}
          />
          <button
            tabIndex={-1}
            type='button'
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className='absolute lg:top-5 md:top-[10px] top-[9px] right-3 flex items-center text-gray-200 cursor-pointer'
          >
            {showConfirmPassword ? (
              <EyeOff className='size-6' />
            ) : (
              <Eye className='size-6' />
            )}
          </button>
          {errors.passwordConfirmation && (
            <p className='text-red-500 lg:text-[16px] text-[13px] mt-1'>
              {errors.passwordConfirmation.message}
            </p>
          )}
        </div>
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
