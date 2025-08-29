'use client';

import { useState } from 'react';
import axios from 'axios';
import { EpigramResponse, Epigram } from '@/types/today';
import EpigramCard from './EpigramCard';
import { Button } from './ui/button';

interface NewEpigramProps {
  data: EpigramResponse; // 초기 데이터
}

export default function NewEpigram({ data }: NewEpigramProps) {
  const [epigrams, setEpigrams] = useState<Epigram[]>(data.list || []);
  const [nextCursor, setNextCursor] = useState<number | null>(
    data.nextCursor || null
  );
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!nextCursor) return; // 더 가져올 데이터가 없으면 종료

    setLoading(true);
    try {
      const { data: newData } = await axios.get<EpigramResponse>(
        `https://fe-project-epigram-api.vercel.app/16-10/epigrams?limit=5&cursor=${nextCursor}`
      );

      if (newData.list && newData.list.length > 0) {
        setEpigrams((prev) => [...prev, ...newData.list]);
        setNextCursor(newData.nextCursor || null); // 다음 커서 업데이트
      } else {
        setNextCursor(null); // 더 이상 데이터 없음
      }
    } catch (error) {
      console.error('에피그램 로딩 실패', error);
    } finally {
      setLoading(false);
    }
  };

  if (!epigrams || epigrams.length === 0) return null;

  return (
    <>
      {epigrams.map((epigram: Epigram) => (
        <EpigramCard key={epigram.id} data={epigram} />
      ))}
      {nextCursor && (
        <Button variant='outline' onClick={handleClick} disabled={loading}>
          {loading ? '로딩중...' : '에피그램 더보기'}
        </Button>
      )}
    </>
  );
}
