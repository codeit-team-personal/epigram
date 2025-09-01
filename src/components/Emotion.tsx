'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { EmotionType } from '@/types/emotion';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://fe-project-epigram-api.vercel.app/16-10';
const USER_ID = process.env.NEXT_PUBLIC_API_ID;
const TOKEN = process.env.NEXT_PUBLIC_API_TOKEN as string;

const emotions = [
  { id: 'MOVED', label: '감동', emoji: '😍' },
  { id: 'HAPPY', label: '기쁨', emoji: '😊' },
  { id: 'WORRIED', label: '고민', emoji: '🤔' },
  { id: 'SAD', label: '슬픔', emoji: '😢' },
  { id: 'ANGRY', label: '분노', emoji: '😡' },
];

export default function Emotion({ title }: { title: string }) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<EmotionType>({
    queryKey: ['emotion', USER_ID],
    queryFn: async () => {
      const res = await axios.get(
        `${API_URL}/emotionLogs/today?userId=${USER_ID}`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      return res.data;
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (emotion: string) => {
      return (
        await axios.post(
          `${API_URL}/emotionLogs/today`,
          { emotion },
          {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        )
      ).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emotion', USER_ID] });
    },
  });

  const selected = data?.emotion || null;

  if (isLoading) return <div>불러오는 중...</div>;
  if (isError) return <div>에러가 발생했습니다.</div>;

  return (
    <div>
      <h1>{title}</h1>
      <div style={{ display: 'flex', gap: '12px' }}>
        {emotions.map((emotion) => (
          <button
            key={emotion.id}
            onClick={() => mutate(emotion.id)}
            disabled={isPending}
            style={{
              padding: '12px',
              borderRadius: '8px',
              border:
                selected === emotion.id ? '2px solid orange' : '1px solid #ddd',
              backgroundColor: selected === emotion.id ? '#fff7e6' : '#f9f9f9',
            }}
          >
            <div style={{ fontSize: '24px' }}>{emotion.emoji}</div>
            <div>{emotion.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
