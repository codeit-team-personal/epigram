'use client';

import { useQuery } from '@tanstack/react-query';
import { getMonthlyEmotions } from '@/lib/api';
import Chart from './Chart';
import { EmotionType } from '@/types/emotion';
import { User } from '@/types/user';
import Skeleton from './Skeleton';

const EMOTION_LABELS: Record<string, string> = {
  HAPPY: '기쁨',
  MOVED: '감동',
  WORRIED: '걱정',
  SAD: '슬픔',
  ANGRY: '화남',
};

const EMOTION_COLORS: Record<string, string> = {
  HAPPY: '#34D399',
  MOVED: '#FACC15',
  WORRIED: '#A5B4FC',
  SAD: '#60A5FA',
  ANGRY: '#F87171',
};

const EMOTION_IMAGES: Record<string, string> = {
  HAPPY: '/images/emoji/smiling.png',
  SAD: '/images/emoji/sad.png',
  WORRIED: '/images/emoji/thinking.png',
  MOVED: '/images/emoji/heart.png',
  ANGRY: '/images/emoji/frame.png',
};

interface MyChartProps {
  user: User;
  year?: number;
  month?: number;
}

export default function MyChart({
  user,
  year = new Date().getFullYear(),
  month = new Date().getMonth() + 1,
}: MyChartProps) {
  if (!user) return <div>로그인이 필요합니다.</div>;

  const { data, isLoading } = useQuery<EmotionType[]>({
    queryKey: ['monthlyEmotions', user.id, year, month],
    queryFn: () =>
      getMonthlyEmotions({
        userId: user.id,
        year,
        month,
      }),
    placeholderData: (prev) => prev,
  });

  if (isLoading) return <Skeleton className='w-full h-64' />;

  if (!data || data.length === 0)
    return (
      <div className='mt-40'>
        <h2 className='text-common mb-20'>감정 차트 </h2>
        <div className='flex flex-col lg:flex-row items-center justify-center gap-6 rounded-lg border border-gray-200 p-6 h-[264px]'>
          조회된 감정 데이터가 없습니다
        </div>
      </div>
    );

  const grouped: Record<string, EmotionType[]> = {};
  data.forEach((log) => {
    if (!log.emotion) return;
    grouped[log.emotion] = grouped[log.emotion] || [];
    grouped[log.emotion].push(log);
  });

  const total = data.length;

  const chartData = Object.entries(grouped)
    .map(([emotion, logs]) => ({
      id: logs[0].id,
      label: EMOTION_LABELS[emotion] || emotion,
      color: EMOTION_COLORS[emotion] || '#E5E7EB',
      image: EMOTION_IMAGES[emotion] || '/images/emoji/default.png', 
      value: logs.length,
      percent: Math.round((logs.length / total) * 100),
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className='mt-40'>
      <h2 className='text-common mb-20'>감정 차트 </h2>
      <Chart
        data={chartData}
        customLabel={(d) => (
          <span className="flex items-center gap-1">
            <img src={d.image} alt={d.label} className="w-4 h-4" />
            {d.percent}%
          </span>
        )}
        customCenter={(d) => (
          <div className='flex flex-col items-center animate-fadeIn'>
            <img src={d.image} alt={d.label} className="w-8 h-8 mb-2" />
            <span className='text-sm text-gray-500'>{d.percent}%</span>
          </div>
        )}
      />
    </div>
  );
}
