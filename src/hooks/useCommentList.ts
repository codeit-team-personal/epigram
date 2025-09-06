'use client';

import { useInfiniteQuery, InfiniteData } from '@tanstack/react-query';
import { Comments as CommentsType } from '@/types/comments';
import { getEpigramDetailComments } from '@/lib/api';


/**
 * 특정 에피그램(epigram)의 댓글을 커서 기반으로 무한 로드하는 커스텀 훅
 *
 * @param epigramId - 댓글을 가져올 대상 에피그램의 ID
 * @returns comments: 평탄화된 전체 댓글 리스트
 *          totalCount: 전체 댓글 개수(첫 페이지에서 제공)
 *          fetchNextPage: 다음 페이지(다음 커서) 요청 트리거 함수
 *          hasNextPage: 다음 페이지 존재 여부
 *          isFetchingNextPage: 다음 페이지 로딩 중 여부
 */
export function useCommentList(epigramId: number) {
  // useInfiniteQuery 제네릭 설명:
  // <TQueryFnData, TError, TData, TQueryKey, TPageParam>
  // - TQueryFnData: 쿼리 함수(getEpigramDetailComments)의 반환 타입 -> CommentsType
  // - TError: 에러 타입 -> Error
  // - TData: 최종적으로 훅이 돌려주는 data의 타입
  //          (무한쿼리는 내부적으로 InfiniteData<TQueryFnData, TPageParam> 형태)
  //          여기선 명시적으로 InfiniteData<CommentsType, number | null>로 지정
  // - TQueryKey: queryKey의 타입 -> [string, number]
  // - TPageParam: 페이지 파라미터(커서)의 타입 -> number | null
  const {
    data, // InfiniteData<CommentsType, number | null> | undefined
    fetchNextPage, // 다음 커서를 사용해 다음 페이지를 불러오는 함수
    hasNextPage, // 다음 페이지가 있는지 여부(Boolean)
    isFetchingNextPage, // 다음 페이지를 불러오는 중인지 여부(Boolean)
  } = useInfiniteQuery<
    CommentsType,
    Error,
    InfiniteData<CommentsType, number | null>,
    [string, number],
    number | null
  >({
    // 동일한 키면 캐시/중복요청 방지 및 상태 공유됨
    queryKey: ['comments', epigramId],

    // getNextPageParam()으로 받은 pageParam 값은 쿼리 함수의 파라미터로 전달되므로,
    // 이 값을 이용해 백엔드에 해당 페이지에 해당하는 데이터를 요청할 수 있음
    // 따라서 쿼리 함수를 아래처럼 수정할 수 있음
    //
    // 실제 데이터를 가져오는 함수
    // pageParam은 현재 로드할 "커서" 값이며, 첫 호출은 initialPageParam에서 정의한 값(null)이 들어옴
    queryFn: ({ pageParam }) =>
      getEpigramDetailComments({
        epigramId, // 어떤 에피그램의 댓글인지
        limit: 3, // 한 번에 불러올 댓글 수 (페이지 크기)
        cursor: pageParam, // 다음 페이지를 가리키는 커서(없으면 null)
      }),

    //useInfiniteQuery()에서는 initialPageParam과 getNextPageParam 옵션을 설정해 줘야 함

    // 첫 페이지의 pageParam 값 설정 (커서 기반 페이징에서는 보통 null로 시작)
    initialPageParam: null,

    // getNextPageParam()은 lastPage, allPages, lastPageParam, allPageParams를 파라미터로 전달받음
    // lastPage는 현재까지 중 가장 마지막 페이지의 데이터가 전달됨
    // allPages로는 모든 페이지의 데이터가 전달
    // lastPageParam은 현재까지 중 가장 마지막 페이지의 설정값을 말함
    // allPageParams는 모든 페이지의 각각의 페이지 설정값을 가지고 있게 됨
    // ex) getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) =>
    //                      lastPage.hasMore ? lastPageParam + 1 : undefined,
    //
    // 다음 페이지의 pageParam(=다음 커서)을 어떻게 계산할지 결정
    // 서버가 준 lastPage.nextCursor를 그대로 반환.[api에 nextCursor값이 있어서 계산 안함]
    // 더 이상 다음 커서가 없으면(null/undefined) null을 반환하여 무한로딩 종료
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,

    // epigramId가 유효할 때만 쿼리 실행
    // (0, NaN 같은 falsy 값이면 요청하지 않도록 방지)
    enabled: !!epigramId,
  });

  // data.pages에 배열의 형태로 모든 페이지의 정보를 담고 있게 됨
  // 맨 처음 첫 번째 페이지의 데이터를 받아오면 data.pages 배열의 0번 인덱스에 해당 데이터가 저장되고,
  // 두 번째 페이지로 넘어가면 data.pages 배열의 1번 인덱스에 데이터가 저장되는 식임.
  // 하나의 배열에 두 페이지의 데이터들이 모두 담겨있으므로 첫 번째와 두 번째 데이터를 한 번에 화면에 보여 줄 수 있음
  // 이런 식으로 더 불러오기를 구현
  // 이 데이터들은 ['comments']라는 하나의 쿼리 키로 캐싱
  //
  // data.pages는 각 페이지의 응답(CommentsType)이 배열로 쌓임
  // 각 페이지의 list를 평탄화하여 하나의 댓글 배열로 변환
  // pages 배열을 Array.map() 함수를 통해 돌면서, 각 페이지에 해당하는 포스트 데이터를 모두 보여 주도록 변경
  const comments = data?.pages.flatMap((page) => page.list) ?? [];

  // 전체 개수는 보통 첫 페이지에 함께 전달되므로 첫 페이지에서만 읽어도 충분
  const totalCount = data?.pages[0]?.totalCount ?? 0;

  return {
    comments,
    totalCount,
    fetchNextPage, // onClick, 인터섹션 옵저버 등으로 호출하여 다음 페이지 로드
    hasNextPage, // 버튼/옵저버 활성화 여부 판단에 사용
    isFetchingNextPage, // 로딩 스피너 제어 등에 사용
  };
}
// fetchNextPage:
// 다음 페이지를 불러오려면 useInfiniteQuery()의 리턴 값 중 하나인 fetchNextPage() 함수를 이용하됨
// fetchNextPage() 함수를 실행하면 getNextPageParam() 함수의 리턴 값이 undefined나 null이 아닌 경우, 
// 해당 리턴 값을 쿼리 함수의 pageParam으로 전달해 그다음 페이지 데이터를 가져옴
// 따라서 우리는 "더 불러오기" 버튼의 onClick() 함수로 fetchNextPage() 함수를 등록해 주면 됨

// isFetchingNextPage:
// "더 불러오기" 버튼을 비활성화
// disabled={!hasNextPage || isFetchingNextPage}