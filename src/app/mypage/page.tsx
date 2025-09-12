'use client';
import MyEmotion from './components/MyEmotion';
import MyEmotionCalendar from './components/MyEmotionCalendar';
import MyHistory from './components/MyHistory';
import MyInfo from './components/MyInfo';

import { useAuthStore } from '@/stores/authStore';

export default function MyPage() {
  const { user } = useAuthStore();
  if (!user) return <div>로그인이 필요합니다.</div>; // user가 null이면 다른 화면 보여주기

  return (
    <section>
      <div className='bg-white rounded-4xl'>
        <MyInfo user={user} />
        <MyEmotion user={user} />
        <MyEmotionCalendar user={user} />
      </div>
      <MyHistory user={user} />
    </section>
  );
}
