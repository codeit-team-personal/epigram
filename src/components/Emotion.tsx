'use client';

import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { EmotionType } from '@/types/emotion';
import { useAuthStore } from '@/stores/authStore';
import { Skeleton } from '@/components/ui/skeleton';
import { getEmotion } from '@/lib/api';
import { id } from 'zod/v4/locales';
import { format, parseISO } from 'date-fns';

const emotions = [
  {
    id: 'MOVED',
    label: '감동',
    src: '/images/emoji/heart.png',
    borderClass: 'border-4 border-[#FBC85B]',
  },
  {
    id: 'HAPPY',
    label: '기쁨',
    src: '/images/emoji/smiling.png',
    borderClass: 'border-[3px] border-[#48BB98]',
  },
  {
    id: 'WORRIED',
    label: '고민',
    src: '/images/emoji/thinking.png',
    borderClass: 'border-4 border-[#8E80E3]',
  },
  {
    id: 'SAD',
    label: '슬픔',
    src: '/images/emoji/sad.png',
    borderClass: 'border-4 border-[#5195EE]',
  },
  {
    id: 'ANGRY',
    label: '분노',
    src: '/images/emoji/frame.png',
    borderClass: 'border-4 border-[#E46E80]',
  },
];

export default function Emotion({
  title,
  showDate = false,
}: {
  title: string;
  showDate?: boolean;
}) {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const { data, isLoading, isError } = useQuery<EmotionType>({
    queryKey: ['emotion', user?.id],
    queryFn: () => getEmotion({ id: user!.id }),
    enabled: !!user, // user 없으면 요청 안 함
  });

  const monthlyKey = [
    'monthlyEmotions',
    user?.id,
    new Date().getFullYear(),
    new Date().getMonth() + 1,
  ];

  const { mutate, isPending } = useMutation({
    mutationFn: async (emotion: string) => {
      // 서버에 요청 (서버가 새 로그(또는 업데이트된 로그)를 반환한다고 가정)
      return (await api.post(`/emotionLogs/today`, { emotion })).data;
    },

    // 오늘의 감정 선택하면 mypage 달력에서도 동시에 적용되는 로직
    // 낙관적 업데이트(optimistic update)
    onMutate: async (emotion) => {
      // 1) 현재 쿼리 취소(충돌 방지)
      await queryClient.cancelQueries({ queryKey: monthlyKey });

      // 2) 이전 캐시 백업 (롤백에 사용)
      const previous = queryClient.getQueryData<EmotionType[]>(monthlyKey);

      // 3) 오늘 key (로컬 타임존 기준)
      // 오늘 날짜의 yyyy-mm-dd 문자열
      const todayKey = format(new Date(), 'yyyy-MM-dd');

      // 4) 낙관적 업데이트: 캐시 직접 변경
      // setQueryData는 지정한 쿼리 키(queryKey)에 연결된 캐시 데이터를 즉시 변경
      queryClient.setQueryData<EmotionType[]>(monthlyKey, (old) => {
        // old는 기존 캐시값(감정 로그 배열)입니다. 없으면 그대로 반환. (캐시가 없으면 무엇을 추가할지 모르므로 변경하지 않음.)
        const _old = old ?? [];

        // 오늘 날짜에 해당하는 기존 로그(이미 있으면)를 찾음
        const existing = _old.find(
          (log) => format(parseISO(log.createdAt), 'yyyy-MM-dd') === todayKey
        );

        // 이미 오늘 로그가 있으면 그 항목의 emotion만 바꾸고, 없으면 새 항목을 로컬 캐시에 추가
        if (existing) {
          // 오늘 기록 있으면 업데이트
          return _old.map((log) =>
            log.id === existing.id ? { ...log, emotion } : log
          );
        } else {
          const tempId = `temp-${Date.now()}`; // 안전한 임시 id(클라이언트에서 임시로 만든 유니크 값): 서버 응답을 기다리지 않고 즉시 UI에 반영하려고 임시 데이터를 추가한 것
          // 없으면 새로 추가
          return [
            ..._old,
            {
              id: tempId, // 타입 맞추려면 타입을 string|number로 변경 권장
              userId: user!.id,
              emotion,
              createdAt: new Date().toISOString(),
            } as EmotionType,
          ];
        }
      });

      // onMutate에서 rollback용 context 반환
      return { previous };
    },
    onError: (err, variables, context) => {
      // 실패 시 롤백
      if (context?.previous) {
        queryClient.setQueryData(monthlyKey, context.previous);
      }
    },
    onSettled: () => {
      // 성공/실패 상관없이 서버 데이터와 싱크 맞추기 위해 재조회
      queryClient.refetchQueries({ queryKey: monthlyKey });
      queryClient.refetchQueries({ queryKey: ['emotion', user?.id] });
    },
  });

  const selected = data?.emotion || null;

  if (isLoading)
    return (
      <div>
        <div className='mb-30 '>
          <h1 className='text-common mb-10'>{title}</h1>
          <div className='flex gap-5 px-10 h-[132px]'>
            <div className=''>
              <Skeleton className='w-24 h-24 rounded-xl' />
              <Skeleton className='h-5 w-24 mt-2' />
            </div>
            <div className=''>
              <Skeleton className='w-24 h-24 rounded-xl' />
              <Skeleton className='h-5 w-24 mt-2' />
            </div>
            <div className=''>
              <Skeleton className='w-24 h-24 rounded-xl' />
              <Skeleton className='h-5 w-24 mt-2' />
            </div>
            <div className=''>
              <Skeleton className='w-24 h-24 rounded-xl' />
              <Skeleton className='h-5 w-24 mt-2' />
            </div>
            <div className=''>
              <Skeleton className='w-24 h-24 rounded-xl' />
              <Skeleton className='h-5 w-24 mt-2' />
            </div>
          </div>
        </div>
      </div>
    );
  if (isError)
    return (
      <div>
        <div className='mb-30 '>
          <h1 className='text-common mb-10'>에러가 발생</h1>
          <div className='flex gap-5 px-10 h-[132px]'>
            <div className=''>
              <Skeleton className='w-24 h-24 rounded-xl' />
              <Skeleton className='h-5 w-24 mt-2' />
            </div>
            <div className=''>
              <Skeleton className='w-24 h-24 rounded-xl' />
              <Skeleton className='h-5 w-24 mt-2' />
            </div>
            <div className=''>
              <Skeleton className='w-24 h-24 rounded-xl' />
              <Skeleton className='h-5 w-24 mt-2' />
            </div>
            <div className=''>
              <Skeleton className='w-24 h-24 rounded-xl' />
              <Skeleton className='h-5 w-24 mt-2' />
            </div>
            <div className=''>
              <Skeleton className='w-24 h-24 rounded-xl' />
              <Skeleton className='h-5 w-24 mt-2' />
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className='mb-30'>
      <div className='flex justify-between'>
        <h1 className='text-common mb-10'>{title}</h1>
        {showDate && data?.createdAt && (
          <p className='text-sm text-gray-400'>
            {new Date(data.createdAt).toLocaleDateString()}
          </p>
        )}
      </div>
      <div className='flex gap-5 px-10'>
        {emotions.map((emotion) => (
          <div key={emotion.id}>
            <button
              onClick={() => mutate(emotion.id)}
              disabled={isPending}
              className={`cursor-pointer px-3 py-2 rounded-2xl w-24 h-24
            ${
              selected === emotion.id
                ? `selected-border-${emotion.id}`
                : 'border-gray-300 bg-gray-custom'
            }`}
            >
              <Image
                src={emotion.src}
                alt={emotion.label}
                width={48}
                height={48}
                className='mx-auto'
              />
            </button>
            <div className='mt-2 text-center text-gray-400 font-semibold text-xl'>
              {emotion.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
