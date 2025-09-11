'use client';

import clsx from 'clsx';
import { ChartData } from './Chart';

interface ChartLegendProps {
  data: ChartData[];
  onLegendClick: (id: ChartData['id']) => void;
  getLabel?: (data: ChartData) => React.ReactNode;
}

export default function ChartLegend({
  data,
  onLegendClick,
  getLabel,
}: ChartLegendProps) {
  return (
    <ul className='grid gap-2 lg:gap-3'>
      {data.map((d, idx) => (
        <li
          key={d.id}
          className='flex cursor-pointer items-center gap-2 lg:gap-4 transition-all duration-200 hover:scale-105'
          onClick={() => onLegendClick(d.id)}
        >
          <span
            className='h-3 w-3 lg:h-4 lg:w-4 rounded-sm'
            style={{ background: d.color }}
          />
          <span className={clsx(idx === 0 ? 'opacity-100' : 'opacity-60')}>
            {getLabel ? getLabel(d) : d.label}
          </span>
        </li>
      ))}
    </ul>
  );
}
