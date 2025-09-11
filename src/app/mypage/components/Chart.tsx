'use client';

import { useState, useMemo } from 'react';
import { Chart as ChartJS, ArcElement, ChartOptions } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import ChartLegend from './ChartLegend';

ChartJS.register(ArcElement);

export type ChartData = {
  id: string | number;
  label: string;
  color: string;
  value: number;
  percent?: number;
};

interface ChartProps {
  data: ChartData[];
  customLabel?: (data: ChartData) => React.ReactNode;
  customCenter?: (activeData: ChartData) => React.ReactNode;
  showLegend?: boolean;
}

export default function Chart({
  data,
  customLabel,
  customCenter,
  showLegend = true,
}: ChartProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const selectedData = useMemo(() => data[currentIndex], [data, currentIndex]);

  if (data.length === 0) {
    return <div className='text-gray-500 p-6'>조회된 데이터가 없습니다</div>;
  }

  const chartOptions: ChartOptions<'doughnut'> = {
    cutout: '85%',
    responsive: true,
    plugins: { legend: { display: false } },
    onClick: (_, active) => {
      if (active.length > 0) setCurrentIndex(active[0].index);
    },
    onHover: (event, chartElement) => {
      if (event.native?.target) {
        (event.native.target as HTMLElement).style.cursor = chartElement[0]
          ? 'pointer'
          : 'default';
      }
    },
  };

  return (
    <div className='flex flex-col lg:flex-row items-center justify-center gap-6 rounded-lg border border-gray-200 p-6'>
      {/* Chart */}
      <div className='relative w-40 h-40 lg:w-52 lg:h-52'>
        <Doughnut
          data={{
            datasets: [
              {
                data: data.map((d) => d.value),
                backgroundColor: data.map((d) => d.color),
                borderWidth: 0,
                hoverOffset: 8,
                borderRadius: 8,
              },
            ],
          }}
          options={chartOptions}
        />
        <div className='pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center'>
          {customCenter?.(selectedData)}
        </div>
      </div>

      {/* Legend */}
      {showLegend && (
        <ChartLegend
          data={data}
          onLegendClick={(id) => {
            const idx = data.findIndex((d) => d.id === id);
            if (idx >= 0) setCurrentIndex(idx);
          }}
          getLabel={customLabel}
        />
      )}
    </div>
  );
}
