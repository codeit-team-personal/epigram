import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from '@/types/user'; 

//[최재이]type '@/types/user import 하고 우선 주석 처리 했음.
// interface User {
//   id: string;
//   nickname: string;
//   image: string;
// }

type AuthState = {
  user: User | null;
  setUser: (user: User | null) => void;
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (access: string, refresh: string) => void;
  clearAuth: () => void;
  hasHydrated: boolean;
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
      hasHydrated: false,
    }),
    {
      name: "auth-storage", // localStorage key
      onRehydrateStorage: () => (state) => {
        if (state) state.hasHydrated = true;
      },
    }
  )
);
