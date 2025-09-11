'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMonthlyEmotions } from '@/lib/api';
import { EmotionType } from '@/types/emotion';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  addMonths,
  subMonths,
} from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { User } from '@/types/user';
import MyChart from './MyChart';

interface MyEmotionCalendarProps {
  user: User;
}

const emotionMap: Record<string, string> = {
  HAPPY: '😊',
  SAD: '😢',
  WORRIED: '😟',
  MOVED: '😍',
  ANGRY: '😡',
};

type EmotionKey = keyof typeof emotionMap;

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export default function MyEmotionCalendar({ user }: MyEmotionCalendarProps) {
  if (!user) return <div>로그인이 필요합니다.</div>;
  const [currentDate, setCurrentDate] = useState(new Date()); // 현재 보고 있는 달
  const [filterEmotion, setFilterEmotion] = useState<string>(''); // 필터 상태

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const { data, isLoading } = useQuery<EmotionType[]>({
    queryKey: ['monthlyEmotions', user?.id, year, month],
    queryFn: () => getMonthlyEmotions({ userId: user.id, year, month }),
    enabled: !!user?.id,
    //데이터를 가져오는 동안 표시할 임시 데이터를 미리 설정하여 사용자 경험을 개선
    placeholderData: [],
  });

  // 날짜별 감정 매핑
  const emotionByDate: Record<string, string> = {};
  data?.forEach((log) => {
    const dateKey = format(new Date(log.createdAt), 'yyyy-MM-dd');
    // undefined일 경우 빈 문자열로 처리
    emotionByDate[dateKey] = log.emotion ?? '';
  });

  // 이번 달 전체 날짜
  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className='space-y-4'>
      <CalendarHeader
        year={year}
        month={month}
        onPrev={() => setCurrentDate(subMonths(currentDate, 1))}
        onNext={() => setCurrentDate(addMonths(currentDate, 1))}
      />

      <EmotionFilter
        filterEmotion={filterEmotion}
        setFilterEmotion={setFilterEmotion}
      />

      <CalendarGrid
        days={days}
        emotionByDate={emotionByDate}
        filterEmotion={filterEmotion}
      />
      <MyChart user={user} year={year} month={month} />
    </div>
  );
}

// 컴포넌트 분리

function CalendarHeader({
  year,
  month,
  onPrev,
  onNext,
}: {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className='flex justify-between items-center mb-2'>
      <h2 className='text-lg font-semibold'>
        {year}년 {month}월
      </h2>
      <div className='flex gap-2'>
        <Button variant='outline' onClick={onPrev}>
          이전 달
        </Button>
        <Button variant='outline' onClick={onNext}>
          다음 달
        </Button>
      </div>
    </div>
  );
}

function EmotionFilter({
  filterEmotion,
  setFilterEmotion,
}: {
  filterEmotion: EmotionKey | '';
  setFilterEmotion: (value: EmotionKey | '') => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline'>
          필터: {filterEmotion ? emotionMap[filterEmotion] : '없음'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='flex gap-2 rounded-xl shadow-lg'>
        <Button
          variant={filterEmotion === '' ? 'default' : 'outline'}
          onClick={() => setFilterEmotion('')}
        >
          전체
        </Button>
        {Object.entries(emotionMap).map(([key, emoji]) => (
          <Button
            key={key}
            variant={filterEmotion === key ? 'default' : 'outline'}
            onClick={() => setFilterEmotion(key as EmotionKey)}
          >
            {emoji}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  );
}

function CalendarGrid({
  days,
  emotionByDate,
  filterEmotion,
}: {
  days: Date[];
  emotionByDate: Record<string, EmotionKey | ''>;
  filterEmotion: EmotionKey | '';
}) {
  return (
    <div className='grid grid-cols-7 gap-2 text-center'>
      {WEEKDAYS.map((d) => (
        <div key={d} className='font-bold'>
          {d}
        </div>
      ))}

      {days.map((day) => {
        const key = format(day, 'yyyy-MM-dd');
        const logEmotion = emotionByDate[key];
        const emoji = logEmotion ? (emotionMap[logEmotion] ?? '') : '';
        const isToday =
          format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
        const isFiltered = filterEmotion === '' || logEmotion === filterEmotion;

        return (
          <div
            key={key}
            className={`h-16 flex flex-col items-center justify-center border rounded transition-colors duration-200 ${
              isToday ? 'bg-yellow-200 border-yellow-400' : ''
            }`}
          >
            <span className='text-sm'>{format(day, 'd')}</span>
            <span className='text-xl'>{isFiltered ? emoji : ''}</span>
          </div>
        );
      })}
    </div>
  );
}
