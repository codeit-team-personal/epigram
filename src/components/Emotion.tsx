import { Emotion as EmotionType } from '@/types/emotion';

interface EmotionProps {
  data: EmotionType;
}

export default function Emotion({ data }: EmotionProps) {
  if (!data) {
    return <div>오늘의 감정 데이터 없음</div>;
  }
  return (
    <div>
      아직 안만듬
      {/* 1. get 먼저 요청 -오늘의 감정이 있어-  그럼 보여줌 
      2. 없어 그럼 그냥 보여줌
      3. 클릭을 하면 post 요청 */}
    </div>
  );
}
