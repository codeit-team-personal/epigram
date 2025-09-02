"use client";

import { useAuthStore } from "@/stores/authStore";
import api from "@/lib/axios";

export function useAuth() {
  const { setTokens, clearTokens, setUser } = useAuthStore();

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/signIn", { email, password });
    const { accessToken, refreshToken } = res.data;

    setTokens(accessToken, refreshToken);

    const response = await api.get("/users/me");
    setUser(response.data);
  };

  const logout = async () => {
    clearTokens();
  };

  return { login, logout };
}
