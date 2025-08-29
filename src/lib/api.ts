import axios from 'axios';
import { Epigram } from '@/types/today';

export async function getTodayEpigram(): Promise<Epigram> {
  const { data } = await axios.get<Epigram>(
    'https://fe-project-epigram-api.vercel.app/16-10/epigrams/today'
  );
  return data;
}
