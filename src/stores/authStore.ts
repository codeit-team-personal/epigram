import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  nickname: string;
  image: string;
}

type AuthState = {
  user: User | null;
  setUser: (user: User | null) => void;
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (access: string, refresh: string) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      accessToken: null,
      refreshToken: null,
      setTokens: (access, refresh) => {
        set({ accessToken: access, refreshToken: refresh });
      },
      clearAuth: () => {
        set({ user: null, accessToken: null, refreshToken: null });
      },
    }),
    {
      name: "auth-storage", // localStorage key
    }
  )
);
