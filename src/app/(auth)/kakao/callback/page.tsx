"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import api from "@/lib/axios";

export default function KakaoCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const { setTokens, setUser } = useAuthStore();

  useEffect(() => {
    const loginWithKakao = async () => {
      if (!code) return;

      try {
        const res = await api.post("/auth/signIn/KAKAO", {
          token: code,
          redirectUri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI,
        });

        // 토큰/유저 정보 zustand store 저장
        setUser(res.data.user);
        setTokens(res.data.accessToken, res.data.refreshToken);

        router.push("/");
      } catch (err) {
        console.error("카카오 로그인 실패:", err);
        router.push("/login?error=kakao");
      }
    };

    loginWithKakao();
  }, [code, router]);

  return <p>로그인 처리 중...</p>;
}
