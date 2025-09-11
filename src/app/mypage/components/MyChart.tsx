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
    return <div className='p-6 text-gray-500'>감정 데이터가 없습니다.</div>;

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
      value: logs.length,
      percent: Math.round((logs.length / total) * 100),
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <Chart
      data={chartData}
      customLabel={(d) => (
        <span>
          {d.label} {d.percent}%
        </span>
      )}
      customCenter={(d) => (
        <div className='flex flex-col items-center animate-fadeIn'>
          <span className='text-lg font-bold'>{d.label}</span>
          <span className='text-sm text-gray-500'>{d.percent}%</span>
        </div>
      )}
    />
  );
}
