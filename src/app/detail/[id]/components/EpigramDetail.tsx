'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  useQuery,
  useQueryClient,
  useMutation,
  InfiniteData,
} from '@tanstack/react-query';
import { Epigram } from '@/types/today';
import {
  getEpigramDetail,
  likeEpigram,
  unlikeEpigram,
  deleteEpigram,
} from '@/lib/api';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { ThumbsUp, ArrowUpRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import DeleteEpigramDialog from '@/components/DeleteEpigramDialog';
import { Comments as CommentsType } from '@/types/comments';
import type { AxiosError } from 'axios';
import { Skeleton } from '@/components/ui/skeleton';

export default function EpigramDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false); // ★ 다이얼로그 제어
  const menuRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const { data, isLoading, isError } = useQuery<Epigram>({
    queryKey: ['epigramDetail', id],
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
      if (!data) throw new Error('데이터 없음');
      return data.isLiked ? await unlikeEpigram(id) : await likeEpigram(id);
    },

    // 낙관적 업데이트
    onMutate: async () => {
      // 좋아요 데이터를 refetch하는 것을 막기 위해 cancelQueries()를 실행해서
      // 좋아요 데이터를 받아오는 쿼리가 실행 중이라면 취소
      await queryClient.cancelQueries({ queryKey: ['epigramDetail', id] });
      // 그전에 기존의 쿼리 데이터도 따로 저장
      // 뮤테이션 실행 중 에러가 발생하면 이전의 데이터로 롤백하기 위해
      const prevData = queryClient.getQueryData<Epigram>(['epigramDetail', id]);

      if (prevData) {
        const updated: Epigram = {
          ...prevData,
          isLiked: !prevData.isLiked,
          likeCount: prevData.likeCount + (prevData.isLiked ? -1 : 1),
        };

        // 상세 캐시 업데이트
        queryClient.setQueryData(['epigramDetail', id], updated);

        // 리스트 캐시들에도 반영
        const patchList = (old?: { list?: Epigram[] }) =>
          old?.list
            ? { ...old, list: old.list.map((e) => (e.id === id ? updated : e)) }
            : old;

        queryClient.setQueriesData({ queryKey: ['epigrams'] }, patchList);
        queryClient.setQueriesData({ queryKey: ['myEpigrams'] }, patchList);
      }

      return { prevData }; //수정하기 전의 데이터를 리턴 [실패 시 롤백용]
    },

    // 에러 발생 시 롤백
    // onError에서는 세 번째 파라미터로 context를 받아오는데,
    // 이 context에 우리가 onMutate에서 리턴한 데이터가 들어 있음
    // 이걸로 해당 포스트의 좋아요 데이터를 이전 데이터로 복원 가능
    onError: (err: unknown, _, ctx) => {
      if (ctx?.prevData) {
        queryClient.setQueryData(['epigramDetail', id], ctx.prevData);

        const rollback = (old?: { list?: Epigram[] }) =>
          old?.list
            ? {
                ...old,
                list: old.list.map((e) => (e.id === id ? ctx.prevData! : e)),
              }
            : old;

        queryClient.setQueriesData({ queryKey: ['epigrams'] }, rollback);
        queryClient.setQueriesData({ queryKey: ['myEpigrams'] }, rollback);
      }

      if (typeof err === 'object' && err && 'message' in err) {
        // if ("message" in err)
        // 여기 들어오면 err는 최소한 { message: any } 형태라고 보장됨
        // err라는 값이 객체고, 그 안에 message라는 프로퍼티가 있다고 보면됨
        // 안쪽 블록에서는 err.message 접근이 안전
        console.error('like error', (err as Error).message);
      } else {
        console.error('like error', err);
      }

      toast.error('좋아요 처리 중 오류가 발생했습니다.');
    },

    // 성공 시 동기화
    onSuccess: (serverEpigram) => {
      const current = queryClient.getQueryData<Epigram>(['epigramDetail', id]);
      const next = (serverEpigram as Epigram) ?? current;

      if (next) {
        queryClient.setQueryData(['epigramDetail', id], next);

        const patchList = (old?: { list?: Epigram[] }) =>
          old?.list
            ? { ...old, list: old.list.map((e) => (e.id === id ? next : e)) }
            : old;

        queryClient.setQueriesData({ queryKey: ['epigrams'] }, patchList);
        queryClient.setQueriesData({ queryKey: ['myEpigrams'] }, patchList);
      }

      const likedNow = (serverEpigram as Epigram)?.isLiked ?? !data?.isLiked;
      likedNow
        ? toast.success('좋아요 성공!')
        : toast.warn('좋아요가 취소되었습니다.');
    },

    // 서버와 최종 동기화
    // onSettled는 성공, 실패 여부에 상관없이 항상 실행
    onSettled: () => {
      // 제대로 된 서버 데이터로 동기화하기 위해 성공과 실패 여부에 상관없이
      // invalidateQueries() 함수로 데이터를 refetch!
      // 성공/실패 상관없이 서버 데이터 새로 불러오기
      queryClient.invalidateQueries({ queryKey: ['epigramDetail', id] });
      queryClient.invalidateQueries({ queryKey: ['epigrams'] });
      queryClient.invalidateQueries({ queryKey: ['myEpigrams'] });
    },

    retry: false,
  });

  // 좋아요 버튼을 누르면 toggleLikeMutation 실행
  const handleLike = () => {
    //로그인이 되어 있지 않으면 뮤테이션을 실행하지 않게 리턴한다.
    if (!user?.id) {
      toast.error('로그인이 필요합니다.');
      // 필요하면 로그인 페이지로 이동
      // router.push('/login');
      return;
    }
    toggleLikeMutation.mutate();
  };

  // 삭제 mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteEpigram(String(id)),
    onSuccess: () => {
      toast.success('에피그램이 삭제되었습니다.');

      // 전역 댓글 캐시 업데이트
      queryClient.setQueriesData<InfiniteData<CommentsType>>(
        { queryKey: ['comments'] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              list: page.list.filter((c) => c.epigramId !== id),
            })),
          };
        }
      );

      // 내 댓글 캐시 업데이트 (MyHistory)
      if (user?.id) {
        queryClient.setQueriesData<InfiniteData<CommentsType>>(
          { queryKey: ['myComments', user.id] },
          (old) => {
            if (!old) return old;
            return {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                list: page.list.filter((c) => c.epigramId !== id),
              })),
            };
          }
        );
      }

      queryClient.invalidateQueries({ queryKey: ['epigrams'] });
      queryClient.invalidateQueries({ queryKey: ['myEpigrams'] });
      router.push('/'); // 삭제 후 메인으로 이동
    },
    onError: () => {
      toast.error('삭제 중 오류가 발생했습니다.');
    },
  });

  if (isLoading || isError) {
    return (
      <div className='bg-white relative font-iropke'>
        {/* 줄무늬 배경 */}
        <div className='absolute inset-0 bg-[linear-gradient(to_bottom,#f5f5f5_1px,transparent_1px)] bg-[length:100%_32px]' />

        <div className='lg:w-[640px] md:w-[384px] w-[312px] mx-auto py-10 px-4 relative space-y-6'>
          {/* 태그 자리 */}
          <div className='flex gap-2'>
            {isError ? (
              <p className='text-red-500 text-sm'>에러가 발생했습니다.</p>
            ) : (
              <>
                <Skeleton className='h-5 w-12 rounded' />
                <Skeleton className='h-5 w-10 rounded' />
              </>
            )}
          </div>

          {/* 본문 */}
          {isError ? (
            <div className='h-20 flex items-center justify-center text-gray-500'>
              데이터를 불러오지 못했습니다.
            </div>
          ) : (
            <div className='space-y-3'>
              <Skeleton className='h-8 w-3/4 rounded' />
              <Skeleton className='h-8 w-2/3 rounded' />
            </div>
          )}

          {/* 저자 */}
          <div className='flex justify-end'>
            <Skeleton className='h-6 w-24 rounded' />
          </div>

          {/* 버튼 영역 */}
          <div className='flex justify-center gap-4 mt-6'>
            <>
              <Skeleton className='h-10 w-20 rounded-full' />
              <Skeleton className='h-10 w-32 rounded-full' />
            </>
          </div>
        </div>
      </div>
    );
  }
  if (!data) return <div className='p-4 bg-white'>데이터 없음</div>;

  return (
    <div className='bg-white relative font-iropke'>
      {/* 페이지 루트 근처에 다이얼로그 렌더 (메뉴 밖에 위치) */}
      <DeleteEpigramDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onDelete={() => deleteMutation.mutateAsync()} // ★ mutateAsync 사용
        isDeleting={deleteMutation.isPending}
      />
      {/* 줄무늬 배경 */}
      <div className='absolute inset-0 bg-[linear-gradient(to_bottom,#f5f5f5_1px,transparent_1px)] bg-[length:100%_32px]' />

      <div className='lg:w-[640px] md:w-[384px] w-[312px] mx-auto py-10 px-4 relative'>
        {/* 케밥 버튼 */}
        {isAuthor && (
          <div className='absolute top-11 right-2 font-sans' ref={menuRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className='p-1 text-2xl text-blue-400 rounded-lg hover:bg-line-100 hover:text-blue-300'
            >
              ⋮
            </button>
            {menuOpen && (
              <div className='absolute right-0 mt-2 lg:w-[134px] lg:h-[112px] w-[97px] h-[80px] flex flex-col justify-center items-center bg-background border rounded-xl shadow overflow-hidden text-black-600 lg:text-xl text-sm'>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    router.push(`/edit/${id}`);
                  }}
                  className='block w-full h-full text-center px-3 py-2 hover:bg-gray-100 cursor-pointer '
                >
                  수정하기
                </button>
                {/* 트리거 버튼은 이제 다이얼로그 open을 직접 true로 */}
                <button
                  type='button'
                  onClick={() => {
                    setMenuOpen(false); // 먼저 메뉴 닫기
                    setDeleteOpen(true); // 다이얼로그 열기
                  }}
                  className='block w-full h-full text-center px-3 py-2 hover:bg-gray-100 cursor-pointer'
                >
                  삭제하기
                </button>
              </div>
            )}
          </div>
        )}
        {/* 태그 */}
        <div className='flex flex-wrap gap-2 text-blue-400 mt-2 lg:mb-8 mb-6  lg:text-[19px] text-base '>
          {data.tags?.map((tag) => (
            <span key={tag.id}>#{tag.name}</span>
          ))}
        </div>

        {/* 내용 */}
        <p className='text-black-700 lg:text-[32px] text-2xl whitespace-pre-wrap'>
          {data.content}
        </p>

        {/* 저자 */}
        <p className='flex items-center justify-end gap-1 text-right lg:mt-8 mt-6 lg:text-2xl md:text-xl text-base text-blue-400'>
          <span className='shrink-0'>-</span>
          <span className='truncate'>{data.author}</span>
          <span className='shrink-0'>-</span>
        </p>

        {/* 좋아요 버튼 */}
        <div className='flex justify-center mt-10 lg:mb-10 mb-0 gap-4 '>
          <button
            onClick={handleLike}
            className='flex items-center gap-2 rounded-full bg-black-600 px-4 py-2 text-white hover:bg-gray-700 cursor-pointer lg:text-xl text-sm'
          >
            <ThumbsUp
              className={`w-5 h-5 ${data.isLiked ? 'fill-current' : ''} `}
            />
            <span>{data.likeCount}</span>
          </button>
          {data.referenceTitle && (
            <div className='flex items-center gap-1 rounded-full bg-line-100 hover:bg-gray-100 text-gray-300 lg:px-6 px-3 py-3 font-sans lg:text-xl text-sm font-medium cursor-pointer'>
              {/* 원래 레퍼런스 버튼 */}
              <Link
                href={data.referenceUrl!}
                target='_blank'
                rel='noopener noreferrer'
              >
                <button className='flex items-center '>
                  <span className='lg:max-w-[240px] max-w-[160px] truncate'>
                    {data.referenceTitle}
                  </span>
                </button>
              </Link>

              {/* 복사 버튼 */}
              <button
                type='button'
                onClick={() => {
                  if (data.referenceUrl) {
                    navigator.clipboard
                      .writeText(data.referenceUrl)
                      .then(() => {
                        toast.success('주소가 클립보드에 복사되었습니다!');
                      })
                      .catch(() => {
                        toast.error('주소 복사에 실패했습니다.');
                      });
                  }
                }}
                className=' hover:text-gray-200 cursor-pointer'
                title='주소 복사'
              >
                <ExternalLink className='w-5 h-5 flex-shrink-0' />
              </button>
            </div>
          )}
        </div>
      </div>
      {/* 흰색 → 지그재그 → 회색 경계 */}
      <div className="relative top-10 h-10 bg-repeat-x bg-[url('/images/paper.svg')]"></div>
    </div>
  );
}
