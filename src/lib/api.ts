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
export async function getEpigram({
  limit,
  cursor,
}: {
  limit: number;
  cursor: number;
}): Promise<EpigramResponse> {
  const cursorParam = cursor > 0 ? `&cursor=${cursor}` : '';
  const { data } = await api.get<EpigramResponse>(
    `/epigrams?limit=${limit}${cursorParam}`
  );
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

// 에피그램 상세
export async function getEpigramDetail(id: number): Promise<Epigram> {
  const { data } = await api.get<Epigram>(`/epigrams/${id}`);
  return data;
}

//에피그램 좋아요
export async function likeEpigram(id: number) {
  const { data } = await api.post(`/epigrams/${id}/like`);
  return data;
}

//에피그램 싫어요
export async function unlikeEpigram(id: number) {
  const { data } = await api.delete(`/epigrams/${id}/like`);
  return data;
}



//에피그램 상세 comments
export async function getEpigramDetailComments({
  epigramId,
  limit = 3,
  cursor,
}: {
  epigramId: number;
  limit?: number;
  cursor?: number | null;
}): Promise<CommentsType> {
  const cursorParam = cursor ? `&cursor=${cursor}` : '';
  const { data } = await api.get<CommentsType>(
    `/epigrams/${epigramId}/comments?limit=${limit}${cursorParam}`
  );
  return data;
}

// 댓글 생성 API
export const createComment = async ({
  epigramId,
  isPrivate,
  content,
}: {
  epigramId: number;
  isPrivate: boolean;
  content: string;
}) => {
  const { data } = await api.post('/comments', {
    epigramId,
    isPrivate,
    content,
  });
  return data;
};

