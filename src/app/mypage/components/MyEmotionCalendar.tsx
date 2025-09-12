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
  startOfWeek,
  endOfWeek,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { User } from '@/types/user';
import MyChart from './MyChart';
import { ChevronLeft } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';

interface MyEmotionCalendarProps {
  user: User;
}

const emotionMap: Record<string, string> = {
  HAPPY: '/images/emoji/smiling.png',
  SAD: '/images/emoji/sad.png',
  WORRIED: '/images/emoji/thinking.png',
  MOVED: '/images/emoji/heart.png',
  ANGRY: '/images/emoji/frame.png',
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

  // 이번 달 전체 날짜 + 앞뒤 빈칸 포함
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 }), // 일요일 시작
    end: endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 }), // 토요일 끝
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className='w-[640px] mx-auto pb-20'>
      <CalendarHeader
        year={year}
        month={month}
        onPrev={() => setCurrentDate(subMonths(currentDate, 1))}
        onNext={() => setCurrentDate(addMonths(currentDate, 1))}
        filterEmotion={filterEmotion}
        setFilterEmotion={setFilterEmotion}
      />

      <CalendarGrid
        days={days}
        emotionByDate={emotionByDate}
        filterEmotion={filterEmotion}
        currentDate={currentDate}
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
  filterEmotion,
  setFilterEmotion,
}: {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
  filterEmotion: EmotionKey | '';
  setFilterEmotion: (value: EmotionKey | '') => void;
}) {
  return (
    <div className='flex justify-between items-center mb-15 '>
      <h2 className='text-common'>
        {year}년 {month}월
      </h2>
      <div className='flex gap-5'>
        <EmotionFilter
          filterEmotion={filterEmotion}
          setFilterEmotion={setFilterEmotion}
        />
        <div className='flex gap-2'>
          <ChevronLeft
            className='cursor-pointer w-[40px] h-[40px] p-2 rounded-lg  hover:bg-line-100 hover:text-gray-500 mr-2'
            onClick={onPrev}
          />
          <ChevronRight
            className='cursor-pointer w-[40px] h-[40px] p-2 rounded-lg  hover:bg-line-100 hover:text-gray-500'
            onClick={onNext}
          />
        </div>
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
        <Button variant='filter' size='filter'>
          필터:{' '}
          {filterEmotion ? (
            <Image
              src={emotionMap[filterEmotion]}
              alt={filterEmotion}
              width={24}
              height={24}
              className='inline-block w-6 h-6'
            />
          ) : (
            '없음'
          )}
          <ChevronDown className='w-14 h-14' size={100} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='flex gap-2 rounded-xl shadow-[0px_0px_30px_0px_rgba(0,_0,_0,_0.1)] w-160 border-none'>
        <Button
          variant={filterEmotion === '' ? 'popover' : 'popoveroutline'}
          size={filterEmotion === '' ? 'popover' : 'popoveroutline'}
          onClick={() => setFilterEmotion('')}
        >
          전체
        </Button>
        {Object.entries(emotionMap).map(([key, src]) => (
          <div
            key={key}
            className={`w-[96px] h-[96px] cursor-pointer rounded-2xl flex justify-center items-center  ${
              filterEmotion === key
                ? `selected-border-${filterEmotion}`
                : 'border-gray-300 bg-gray-custom'
            }`}
            // variant={filterEmotion === key ? 'filter' : 'outline'}
            onClick={() => setFilterEmotion(key as EmotionKey)}
          >
            <Image
              src={src}
              alt={key}
              width={48}
              height={48}
              className='w-12 h-12'
            />
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}

function CalendarGrid({
  days,
  emotionByDate,
  filterEmotion,
  currentDate,
}: {
  days: Date[];
  emotionByDate: Record<string, EmotionKey | ''>;
  filterEmotion: EmotionKey | '';
  currentDate: Date;
}) {
  return (
    <div
      className='grid grid-cols-7 text-center text-2xl 
    font-semibold text-gray-200 '
    >
      {WEEKDAYS.map((d) => (
        <div key={d} className='border-t border-b border-blue-200 py-6'>
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

        const isCurrentMonth = day.getMonth() === currentDate.getMonth();

        return (
          <div
            key={key}
            className={`h-[91px] font-semibold flex flex-col items-center border-b justify-center transition-colors duration-200
        ${isCurrentMonth ? 'text-gray-200' : 'text-gray-400 opacity-50'}
        ${isToday ? 'outline-state outline-4 rounded-xs border border-state z-2' : ''}
      `}
          >
            <span
              className={
                isToday
                  ? 'text-2xl'
                  : isFiltered && logEmotion
                    ? 'text-base'
                    : 'text-2xl'
              }
            >
              {format(day, 'd')}
            </span>

            {isFiltered && logEmotion && (
              <Image
                src={emotionMap[logEmotion]}
                alt={logEmotion}
                width={36}
                height={36}
                className='w-9 h-9'
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
