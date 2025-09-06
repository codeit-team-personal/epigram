'use client';

import { useQuery } from '@tanstack/react-query';
import { Epigram } from '@/types/today';
import { getTodayEpigram } from '@/lib/api';
import EpigramDetail from './components/EpigramDetail';
import EpiDetailCommentList from './components/EpiDetailCommentList';

export default function Detail() {
  return (
    <div>
      <EpigramDetail />
      <EpiDetailCommentList />
    </div>
  );
}
