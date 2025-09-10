'use client';

import { useParams } from 'next/navigation';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Epigram } from '@/types/today';
import {
  getEpigramDetail,
  likeEpigram,
  unlikeEpigram,
  deleteEpigram,
} from '@/lib/api';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export default function EpigramDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const { data, isLoading, isError } = useQuery<Epigram>({
    queryKey: ['epigram-detail', id],
    queryFn: () => getEpigramDetail(id),
    enabled: !!id, //id는 Number(params.id)로 만든 값, !!을 붙여 불리언으로 변환
    initialData: () => {
      //queryClient.getQueriesData는 비동기 통신 없이 즉시 캐시에서 데이터를 조회
      const epigrams = queryClient
        .getQueriesData<{ list: Epigram[] }>({ queryKey: ['epigrams'] })
        //React Query의 queryClient.getQueriesData()의 반환값은 Array<[queryKey, data]> 형태.
        //result에는 ({ list: Epigram[] })가 들어감
        //앞의 queryKey는 버리고 뒤의 data만 result로 받는 것.
        .flatMap(([, result]) => result?.list ?? []);
      return epigrams.find((e) => e.id === id);
    },
  });

  // 작성자 여부 체크
  const isAuthor = user && data && Number(user.id) === data.writerId;
  
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
    // 낙관적 업데이트 (Optimistic Update)
    // onMutate: 뮤테이션 함수가 실행되기 바로 전에 실행하는 함수
    onMutate: async () => {
      //좋아요 데이터를 refetch하는 것을 막기 위해 cancelQueries()를 실행해서 좋아요 데이터를 받아오는 쿼리가 실행 중이라면 취소
      await queryClient.cancelQueries({ queryKey: ['epigram-detail', id] });

      //그전에 기존의 쿼리 데이터도 따로 저장
      //뮤테이션 실행 중 에러가 발생하면 이전의 데이터로 롤백하기 위해
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

      return { prevData }; //수정하기 전의 데이터를 리턴 [실패 시 롤백용]
    },
    // onError에서는 세 번째 파라미터로 context를 받아오는데,
    // 이 context에 우리가 onMutate에서 리턴한 데이터가 들어 있음
    // 이걸로 해당 포스트의 좋아요 데이터를 이전 데이터로 복원 가능
    onError: (err, _, context) => {
      // 실패하면 롤백
      if (context?.prevData) {
        queryClient.setQueryData(['epigram-detail', id], context.prevData);
      }
    },
    onSuccess: (_, __, ___) => {
      // 좋아요 성공 시 토스트 메시지
      if (data?.isLiked) {
        toast.success('좋아요 성공!');
      } else {
        toast.warn('좋아요가 취소되었습니다.');
      }
    },

    //onSettled는 성공, 실패 여부에 상관없이 항상 실행
    onSettled: () => {
      // 제대로 된 서버 데이터로 동기화하기 위해 성공과 실패 여부에 상관없이
      // invalidateQueries() 함수로 데이터를 refetch!
      // 성공/실패 상관없이 서버 데이터 새로 불러오기
      queryClient.invalidateQueries({ queryKey: ['epigram-detail', id] });
      queryClient.invalidateQueries({ queryKey: ['epigrams'] });
    },
  });

  // 좋아요 버튼을 누르면 toggleLikeMutation 실행
  const handleLike = () => {
    //로그인이 되어 있지 않으면 뮤테이션을 실행하지 않게 리턴한다.
    if (!id) {
      return toast.error('로그인이 필요합니다. ');
    }
    toggleLikeMutation.mutate();
  };

  // 삭제 mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteEpigram(String(id)),
    onSuccess: () => {
      toast.success('에피그램이 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['epigrams'] });
      router.push('/'); // 삭제 후 메인으로 이동
    },
    onError: () => {
      toast.error('삭제 중 오류가 발생했습니다.');
    },
  });

  const [menuOpen, setMenuOpen] = useState(false);
  if (isLoading) return <div>불러오는 중...</div>;
  if (isError) return <div>에러가 발생했습니다.</div>;
  if (!data)
    return <div className='p-4 rounded-md shadow bg-white'>데이터 없음</div>;

  return (
    <div>
      <div className='p-4 rounded-md shadow bg-white relative'>
        {/* 케밥 버튼 */}
        {isAuthor && (
          <div className='absolute top-2 right-2'>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className='p-1 rounded hover:bg-gray-100'
            >
              ⋮
            </button>
            {menuOpen && (
              <div className='absolute right-0 mt-2 w-28 bg-white border rounded shadow'>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    router.push(`/edit/${id}`);
                  }}
                  className='block w-full text-left px-3 py-2 hover:bg-gray-100'
                >
                  수정
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    if (confirm('정말 삭제하시겠습니까?')) {
                      deleteMutation.mutate();
                    }
                  }}
                  className='block w-full text-left px-3 py-2 text-red-500 hover:bg-gray-100'
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        )}
        {/* 태그 */}
        <div className='mt-2 flex gap-2 text-blue-500 text-xs flex-wrap'>
          {data.tags?.map((tag) => (
            <span key={tag.id}>#{tag.name}</span>
          ))}
        </div>

        {/* 내용 */}
        <p className='text-gray-700'>{data.content}</p>

        {/* 저자 */}
        <p className='text-right mt-2 text-sm text-gray-500'>
          - {data.author} -
        </p>

        {/* 좋아요 버튼 */}
        <button
          onClick={handleLike}
          className={`mt-2 px-3 py-1 rounded ${
            data.isLiked ? 'bg-red-500 text-white' : 'bg-gray-200'
          }`}
        >
          ❤️ {data.likeCount}
        </button>
      </div>
    </div>
  );
}
