"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import api from "@/lib/axios";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const { setTokens, setUser } = useAuthStore();

  useEffect(() => {
    const loginWithGoogle = async () => {
      if (!code) return;

      try {
        const res = await api.post("/auth/signIn/GOOGLE", {
          token: code,
          redirectUri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
        });

        // 토큰/유저 정보 zustand store 저장
        setUser(res.data.user);
        setTokens(res.data.accessToken, res.data.refreshToken);

        // 토큰 저장 로직 (쿠키, Zustand 등)
        router.push("/");
      } catch (err) {
        console.error("구글 로그인 실패:", err);
        router.push("/login?error=google");
      }
    };

    loginWithGoogle();
  }, [code, router]);

  return <p>로그인 처리 중...</p>;
}
