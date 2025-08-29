'use client';

import { useQuery, QueryFunction } from '@tanstack/react-query';

interface MainWrapperProps<T> {
  title: string;
  Component: React.ComponentType<{ data: T }>;
  queryKey: (string | number)[];
  queryFn: QueryFunction<T>;
  alwaysRender?: boolean; //렌더링 여부를 강제적으로 활성화하는 데 사용
}

export default function MainWrapper<T>({
  title,
  Component,
  queryKey,
  queryFn,
  alwaysRender = false, //특정 상황에서만 렌더링이 필요한 경우, 이 속성을 false로 설정하여 불필요한 렌더링을 줄이고 성능을 향상시킬 수 있음
}: MainWrapperProps<T>) {
  const { data, isLoading, isError } = useQuery<T>({
    queryKey,
    queryFn,
  });

  if (isLoading) return <div>불러오는 중...</div>;
  if (isError) return <div>에러가 발생했습니다.</div>;

  return (
    <div>
      <h1>{title}</h1>
      {alwaysRender ? (
        <Component data={data as T} />
        //'as T'를 붙여준 이유는, data가 타입 상으로 T | undefined 일 수 있기 때문에
        // 무조건 T가 되게 강제로 캐스팅하는것임
      ) : (
        data && <Component data={data} />
      )}
    </div>
  );
}
