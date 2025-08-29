// components/EpigramCard.tsx
import { Epigram } from '@/types/today';

interface EpigramCardProps {
  data: Epigram;
}

export default function EpigramCard({ data }: EpigramCardProps) {
  if (!data) return null;

  return (
    <div className='p-4 rounded-md shadow bg-white'>
      <p className='text-gray-700'>{data.content}</p>
      <p className='text-right mt-2 text-sm text-gray-500'>- {data.author} -</p>
      <div className='mt-2 flex gap-2 text-blue-500 text-xs'>
        {data.tags?.map((tag) => (
          <span key={tag.id}>#{tag.name}</span>
        ))}
      </div>
    </div>
  );
}
