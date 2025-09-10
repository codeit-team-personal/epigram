import Emotion from '@/components/Emotion';
import { User } from '@/types/user';
import { useAuthStore } from '@/stores/authStore';

interface MyEmotionProps {
  user: User;
}

export default function MyEmotion({ user }: MyEmotionProps) {
  if (!user) return <div>로그인이 필요합니다.</div>;
  return (
    <div>
      <Emotion title='오늘의 감정' showDate={true} />
    </div>
  );
}
