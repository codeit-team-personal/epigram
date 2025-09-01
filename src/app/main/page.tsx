'use client';

import EpigramCard from '@/components/TodayEpigram';
import Emotion from '@/components/Emotion';
import Comments from '@/components/Comments';
import NewEpigram from '@/components/NewEpigram';
import TodayEpigram from '@/components/TodayEpigram';

export default function Main() {
  return (
    <section>
      <TodayEpigram title='오늘의 에피그램' />
      <Emotion title='오늘의 감정은 어떠신가요?' />
      <NewEpigram title='최신 에피그램' />
      <Comments title='최신 댓글' />
    </section>
  );
}
