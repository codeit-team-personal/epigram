'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, hasHydrated } = useAuthStore();
  const router = useRouter();

  /*
    라우팅, 상태 변경, setState 등은 useEffect 안에서만 실행해야 한다.
    hasHydrated가 false일 때는 store 값이 아직 초기화되지 않은 상태이므로,
    이를 체크한 뒤에만 리다이렉트하도록 해야 불필요한 깜빡임을 줄일 수 있다
  */
  useEffect(() => {
    // hasHydrated가 true인데 user가 없을 때만 redirect
    if (hasHydrated && !user) {
      router.replace('/login');
    }
  }, [hasHydrated, user, router]);

  if (!hasHydrated) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='flex flex-col items-center space-y-4'>
          <div className='h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500' />
          <p className='text-gray-600'>Loading...</p>
        </div>
      </div>
    );
  }

  // redirect 중일 때는 children을 렌더하지 않음
  if (!user) {
    return null;
  }

  return <>{children}</>;
}
