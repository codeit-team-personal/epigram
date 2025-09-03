'use client';

import { useParams } from 'next/navigation';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Epigram } from '@/types/today';
import { getEpigramDetail, likeEpigram, unlikeEpigram } from '@/lib/api';
import EpigramCard from '@/components/EpigramCard';

export default function EpigramDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<Epigram>({
    queryKey: ['epigram-detail', id],
    queryFn: () => getEpigramDetail(id),
    enabled: !!id, //id는 Number(params.id)로 만든 값, !!을 붙여 불리언으로 변환
    initialData: () => {
      const epigrams = queryClient
        .getQueriesData<{ list: Epigram[] }>({ queryKey: ['epigrams'] })
        //React Query의 queryClient.getQueriesData()의 반환값은 Array<[queryKey, data]> 형태.
        //result에는 ({ list: Epigram[] })가 들어감
        //앞의 queryKey는 버리고 뒤의 data만 result로 받는 것.
        .flatMap(([, result]) => result?.list ?? []);
      return epigrams.find((e) => e.id === id);
    },
  });

  // 좋아요 토글 mutation
  const toggleLikeMutation = useMutation({
    mutationFn: async () => {
      if (!data) return;
      if (data.isLiked) {
        return unlikeEpigram(id); // DELETE
      } else {
        return likeEpigram(id); // POST
      }
    },
    // Optimistic Update
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['epigram-detail', id] });

      const prevData = queryClient.getQueryData<Epigram>([
        'epigram-detail',
        id,
      ]);

      // 캐시를 즉시 업데이트
      if (prevData) {
        queryClient.setQueryData<Epigram>(['epigram-detail', id], {
          ...prevData,
          isLiked: !prevData.isLiked,
          likeCount: (prevData.likeCount ?? 0) + (prevData.isLiked ? -1 : 1),
        });
      }

      return { prevData }; // 실패 시 롤백용
    },
    onError: (err, _, context) => {
      // 실패하면 롤백
      if (context?.prevData) {
        queryClient.setQueryData(['epigram-detail', id], context.prevData);
      }
    },
    onSettled: () => {
      // 성공/실패 상관없이 서버 데이터 새로 불러오기
      queryClient.invalidateQueries({ queryKey: ['epigram-detail', id] });
      queryClient.invalidateQueries({ queryKey: ['epigrams'] });
    },
  });

  const handleLike = () => {
    toggleLikeMutation.mutate();
  };

  if (isLoading) return <div>불러오는 중...</div>;
  if (isError) return <div>에러가 발생했습니다.</div>;
  if (!data)
    return <div className='p-4 rounded-md shadow bg-white'>데이터 없음</div>;

  return (
    <div>
      <div>
        <div className='p-4 rounded-md shadow bg-white'>
          <div className='mt-2 flex gap-2 text-blue-500 text-xs flex-wrap'>
            {data.tags?.map((tag) => (
              <span key={tag.id}>#{tag.name}</span>
            ))}
          </div>
          <p className='text-gray-700'>{data.content}</p>
          <p className='text-right mt-2 text-sm text-gray-500'>
            - {data.author} -
          </p>
          <button
            onClick={handleLike}
            className={`mt-2 px-3 py-1 rounded ${
              data.likeCount ? 'bg-red-500 text-white' : 'bg-gray-200'
            }`}
          >
            ❤️ {data.likeCount}
          </button>
        </div>
      </div>
    </div>
  );
}
