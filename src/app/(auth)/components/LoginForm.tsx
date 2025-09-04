"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useLoginForm } from "@/hooks/useLoginForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = useLoginForm();

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      await login(data.email, data.password);
      router.push("/");
    } catch (err) {
      setError("email", {
        type: "manual",
        message: "이메일 혹은 비밀번호를 확인해주세요.",
      });
      setError("password", {
        type: "manual",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Email */}
      <div>
        <Input
          type='email'
          placeholder='이메일'
          {...register("email")}
          className={`lg:h-[64px] h-[44px] lg:text-xl md:text-[16px] text-[16px] placeholder:text-blue-400 bg-blue-200 lg:mt-4 mt-2 ${
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
      <div className='relative'>
        <Input
          type={showPassword ? "text" : "password"}
          placeholder='비밀번호'
          {...register("password")}
          className={`lg:h-[64px] h-[44px] lg:text-xl md:text-[16px] text-[16px] placeholder:text-blue-400 bg-blue-200 lg:mt-4 mt-2 ${
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

      <Button
        disabled={isSubmitting || !isValid}
        type='submit'
        className='lg:text-xl w-full lg:h-[64px] h-[44px] my-8 cursor-pointer'
      >
        {isSubmitting ? "로그인 중..." : "로그인"}
      </Button>
    </form>
  );
}
