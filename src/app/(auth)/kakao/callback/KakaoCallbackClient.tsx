// app/(auth)/kakao/callback/KakaoCallbackClient.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import api from "@/lib/axios";

export default function KakaoCallbackClient({ code }: { code?: string }) {
  const router = useRouter();
  const { setTokens, setUser } = useAuthStore();

  useEffect(() => {
    const loginWithKakao = async () => {
      // 쿼리에 code가 없으면 로그인 페이지로
      if (!code) {
        router.replace("/login?error=missing_code");
        return;
      }

      try {
        const res = await api.post("/auth/signIn/KAKAO", {
          token: code,
          redirectUri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI,
        });

        // 토큰/유저 정보 zustand store 저장
        setUser(res.data.user);
        setTokens(res.data.accessToken, res.data.refreshToken);

        router.replace("/");
      } catch (err) {
        console.error("카카오 로그인 실패:", err);
        router.replace("/login?error=kakao");
      }
    };

    loginWithKakao();
    // setUser/setTokens는 안정적인 참조(상태 라이브러리에 따라 바뀌지 않음)라고 가정
  }, [code, router, setTokens, setUser]);

  return (
    <div className='flex h-screen items-center justify-center'>
      <div className='flex flex-col items-center space-y-4'>
        {/* 스피너 */}
        <div className='h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500' />
        {/* 안내 문구 */}
        <p className='text-gray-600'>카카오 계정으로 로그인 중입니다...</p>
      </div>
    </div>
  );
}
