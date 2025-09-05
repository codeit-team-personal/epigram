'use client';

import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { EmotionType } from '@/types/emotion';
import { useAuthStore } from '@/stores/authStore';
import { Skeleton } from '@/components/ui/skeleton';
import { getEmotion } from '@/lib/api';

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

export default function Emotion({ title }: { title: string }) {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

 
  const { data, isLoading, isError } = useQuery<EmotionType>({
    queryKey: ['emotion', user?.id],
    queryFn: () => getEmotion({ id: user!.id }),
    enabled: !!user, // user 없으면 요청 안 함
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (emotion: string) => {
      return (await api.post(`/emotionLogs/today`, { emotion })).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emotion', user?.id] });
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
      <h1 className='text-common mb-10'>{title}</h1>
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
