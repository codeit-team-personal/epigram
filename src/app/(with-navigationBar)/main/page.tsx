'use client';

import MainWrapper from './components/MainWrapper';
import TodayEpi from '@/components/EpigramCard';
import Emotion from '@/components/Emotion';
import Comments from '@/components/Comments';
import {
  getTodayEpigram,
  getComments,
  getEmotion,
  getEpigram,
} from '@/lib/api';
import NewEpigram from '@/components/NewEpigram';

export default function Main() {
  return (
    <section>
      <MainWrapper
        title='오늘의 에피그램'
        Component={TodayEpi}
        queryKey={['today-epigram']}
        queryFn={getTodayEpigram}
      />

      <MainWrapper
        title='오늘의 감정은 어떠신가요?'
        Component={Emotion}
        queryKey={['emotions']}
        queryFn={getEmotion}
        alwaysRender
      />

      <MainWrapper
        title='최신 에피그램'
        Component={NewEpigram}
        queryKey={['epigram']}
        queryFn={getEpigram}
      />

      <MainWrapper
        title='최신 댓글'
        Component={Comments}
        queryKey={['comments']}
        queryFn={getComments}
      />
    </section>
  );
}
