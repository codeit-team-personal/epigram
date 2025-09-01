// src/hooks/useAuth.ts
"use client";

import { useAuthStore } from "@/stores/authStore";
import api from "@/lib/axios";

export function useAuth() {
  const { setTokens, clearTokens } = useAuthStore();

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/signIn", { email, password });
    const { accessToken, refreshToken } = res.data;

    setTokens(accessToken, refreshToken);
  };

  const logout = async () => {
    clearTokens();
  };

  return { login, logout };
}
