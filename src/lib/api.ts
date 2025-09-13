import api from '@/lib/axios';
import { Epigram, EpigramResponse } from '@/types/today';
import { Comments as CommentsType } from '@/types/comments';
import { EpigramSearchResponse } from '@/types/search';
import { EmotionType } from '@/types/emotion';

// 오늘의 에피그램
export async function getTodayEpigram(): Promise<Epigram> {
  const { data } = await api.get<Epigram>('/epigrams/today');
  return data;
}

// 오늘의 감정
export async function getEmotion({
  id,
}: {
  id: number | string;
}): Promise<EmotionType> {
  const { data } = await api.get<EmotionType>(
    `/emotionLogs/today?userId=${id}`
  );
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
export async function getComments({
  limit = 4,
  cursor,
}: {
  limit?: number;
  cursor?: number | null;
} ): Promise<CommentsType> {
  const cursorParam = cursor ? `&cursor=${cursor}` : '';
  const { data } = await api.get<CommentsType>(
    `/comments?limit=${limit}${cursorParam}`
  );
  return data;
}


// 댓글 수정
export async function updateComment({
  id,
  content,
  isPrivate,
}: {
  id: number;
  content: string;
  isPrivate: boolean;
}) {
  const res = await api.patch(`/comments/${id}`, {
    content,
    isPrivate,
  });
  return res.data;
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
export async function likeEpigram(id: number): Promise<Epigram> {
  const { data } = await api.post<Epigram>(`/epigrams/${id}/like`);
  return data;
}

//에피그램 싫어요
export async function unlikeEpigram(id: number): Promise<Epigram> {
  const { data } = await api.delete<Epigram>(`/epigrams/${id}/like`);
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

// 회원가입 API
export const registerUser = async (data: {
  email: string;
  password: string;
  passwordConfirmation: string;
  nickname: string;
}) => {
  const response = await api.post('/auth/signUp', data);
  return response.data;
};

//에피그램 만들기
export async function createEpigram(payload: {
  content: string;
  author: string;
  referenceTitle?: string;
  referenceUrl?: string;
  tags?: string[];
}): Promise<Epigram> {
  const { data } = await api.post<Epigram>('/epigrams', payload);
  return data;
}

// 에피그램 수정
export async function updateEpigram(
  id: string | number,
  payload: {
    content: string;
    author: string;
    referenceTitle?: string;
    referenceUrl?: string;
    tags?: string[];
  }
) {
  const { data } = await api.patch(`/epigrams/${id}`, payload);
  return data;
}

// 에피그램 삭제
export async function deleteEpigram(id: string) {
  const { data } = await api.delete(`/epigrams/${id}`);
  return data;
}
// 에피그램 검색
export async function getSearchEpigram({
  limit,
  cursor,
  keyword,
}: {
  limit: number;
  cursor: number;
  keyword: string;
}): Promise<EpigramSearchResponse> {
  const cursorParam = cursor > 0 ? `&cursor=${cursor}` : '';
  const keywordParam = keyword ? `&keyword=${encodeURIComponent(keyword)}` : '';
  const { data } = await api.get<EpigramSearchResponse>(
    `/epigrams?limit=${limit}${cursorParam}${keywordParam}`
  );
  return data;
}

// 감정 월간 로그 가져오기
export async function getMonthlyEmotions({
  userId,
  year,
  month,
}: {
  userId: number | string;
  year: number;
  month: number;
}) {
  const { data } = await api.get(
    `/emotionLogs/monthly?userId=${userId}&year=${year}&month=${month}`
  );
  return data;
}

// 내 에피그램 (writerId 기반)
export async function getMyEpigrams({
  writerId,
  limit = 5,
  cursor,
}: {
  writerId: number | string;
  limit?: number;
  cursor?: number;
}) {
  const cursorParam = cursor ? `&cursor=${cursor}` : '';
  const { data } = await api.get<EpigramResponse>(
    `/epigrams?limit=${limit}${cursorParam}&writerId=${writerId}`
  );
  return data;
}

// 내 댓글
export async function getMyComments({
  userId,
  limit = 3,
  cursor,
}: {
  userId: number | string;
  limit?: number;
  cursor?: number | null;
}): Promise<CommentsType> {
  const cursorParam = cursor ? `&cursor=${cursor}` : '';
  const { data } = await api.get<CommentsType>(
    `/users/${userId}/comments?limit=${limit}${cursorParam}`
  );
  return data;
}


