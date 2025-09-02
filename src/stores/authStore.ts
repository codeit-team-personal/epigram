import { create } from "zustand";

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
  clearTokens: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  accessToken: null,
  refreshToken: null,
  setTokens: (access, refresh) => {
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    set({ accessToken: access, refreshToken: refresh });
  },
  clearTokens: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    set({ accessToken: null, refreshToken: null });
  },
}));
