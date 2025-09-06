"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.replace("/login");
  }, [user, router]);

  if (!user)
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='flex flex-col items-center space-y-4'>
          {/* 스피너 */}
          <div className='h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500' />

          <p className='text-gray-600'>Loading...</p>
        </div>
      </div>
    );

  return <>{children}</>;
}
