'use client';
import { CommentAvatar } from '@/components/CommentAvatar';
import { Button } from '@/components/ui/button';
import { User } from '@/types/user';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';

interface MyInfoProps {
  user: User;
}

export default function MyInfo({ user }: MyInfoProps) {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const router = useRouter();

  if (!user) return <div>로그인이 필요합니다.</div>;

  const handleLogout = () => {
    clearAuth(); // zustand 상태 초기화 (user, accessToken, refreshToken 전부 null)
    router.push('/login'); // 로그아웃 후 로그인 페이지로 이동
  };

  return (
    <div className='flex flex-col items-center text-center mt-50 relative top-[-62px]'>
      <div className='w-[120px] h-[120px] rounded-full overflow-hidden'>
        <CommentAvatar
          nickname={user.nickname}
          image={user.image}
          sizeClass='w-[120px] h-[120px] text-6xl'
        />
      </div>

      <h2 className='text-2xl font-black-950 font-medium my-6'>
        {user.nickname}
      </h2>

      <Button variant='logout' size='logout' onClick={handleLogout}>
        로그아웃
      </Button>
    </div>
  );
}
