import axios from 'axios';
import { Epigram, EpigramResponse } from '@/types/today';
import { Comments as CommentsType } from '@/types/comments';
import { EmotionType } from '@/types/emotion';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'x-api-id': process.env.NEXT_PUBLIC_API_ID, // 서버 전용
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
  },
});

// 오늘의 에피그램
export async function getTodayEpigram(): Promise<Epigram> {
  const { data } = await api.get<Epigram>('/epigrams/today');
  return data;
}

// 오늘의 감정
export async function getEmotion(): Promise<EmotionType> {
  const { data } = await api.get<EmotionType>('/emotionLogs/today?userId=2650');
  return data;
}

// 에피그램 리스트
export async function getEpigram(limit = 3): Promise<EpigramResponse> {
  const { data } = await api.get<EpigramResponse>(`/epigrams?limit=${limit}`);
  return data;
}

// 댓글 리스트
export async function getComments(
  url: string = '/comments?limit=4'
): Promise<CommentsType> {
  const { data } = await api.get<CommentsType>(url);
  return data;
}

// 댓글 수정
export async function updateComment({
  id,
  content,
}: {
  id: number;
  content: string;
}) {
  const { data } = await api.patch(`/comments/${id}`, {
    content,
    isPrivate: false,
  });
  return data;
}

// 댓글 삭제
export async function deleteComment(id: number) {
  const { data } = await api.delete(`/comments/${id}`);
  return data;
}
