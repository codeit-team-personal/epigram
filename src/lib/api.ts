import axios from 'axios';
import { Epigram, EpigramResponse } from '@/types/today';
import { Comments } from '@/types/comments';
import { Emotion } from '@/types/emotion';

const api = axios.create({
  baseURL: 'https://fe-project-epigram-api.vercel.app/16-10',
});
// 오늘의 에피그램
export async function getTodayEpigram(): Promise<Epigram> {
  const { data } = await api.get<Epigram>('/epigrams/today');
  return data;
}

// 오늘의 감정
export async function getEmotion(): Promise<Emotion> {
  const { data } = await api.get<Emotion>('/emotionLogs/today?userId=2638');
  return data;
}

// 에피그램 리스트
export async function getEpigram(): Promise<EpigramResponse> {
  const { data } = await api.get<EpigramResponse>('/epigrams?limit=3');
  return data;
}

// 댓글 리스트
export async function getComments(): Promise<Comments> {
  const { data } = await api.get<Comments>('/comments?limit=10');
  return data;
}
