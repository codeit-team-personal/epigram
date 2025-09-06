'use client';

import {
  useMutation,
  useQueryClient,
  InfiniteData,
} from '@tanstack/react-query';
import { List } from '@/types/comments';
import { createComment } from '@/lib/api';
import { Comments as CommentsType } from '@/types/comments';

/**
 * 특정 에피그램(epigramId)에 댓글을 생성하는 커스텀 훅.
 * - 서버에 새 댓글을 생성(mutation)하고
 * - 캐시(Infinite Query 형태)를 즉시 갱신한 뒤
 * - 다시 서버를 invalidate 하여 최종 최신 상태로 동기화
 */
export function useCommentMutation(epigramId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    // 실제 댓글 생성 API 호출 함수
    mutationFn: createComment,

    /**
     * 댓글 생성 성공 시 호출
     * newComment: 서버에서 돌아온 새 댓글 객체(List 타입)
     */
    onSuccess: (newComment: List) => {
      /**
       * 1) 캐시 즉시 반영 (UI가 바로 업데이트되도록)
       *    - 댓글 리스트는 useInfiniteQuery 형태( pages / pageParams )라고 가정
       *    - 키: ['comments', epigramId]
       */
      queryClient.setQueryData<InfiniteData<CommentsType>>(
        ['comments', epigramId],
        (oldData) => {
          // 해당 키에 데이터가 전혀 없다면(첫 로드 전이거나 비어있을 때) 초기 구조를 생성
          if (!oldData) {
            return {
              pages: [
                {
                  // 첫 페이지에 새 댓글 하나만 넣어 시작
                  list: [newComment],
                  nextCursor: 0,
                  totalCount: 0,
                },
              ],
              // useInfiniteQuery의 페이지 파라미터(첫 페이지이므로 null로 시작)
              pageParams: [null],
            };
          }

          // 기존 Infinite 데이터 복사
          const updatedPages = [...oldData.pages];
          const firstPage = updatedPages[0];

          // 새 댓글을 맨 앞에 추가하여 "최신순" 유지
          const newList = [newComment, ...firstPage.list];

          // (비즈니스 규칙) 첫 페이지에는 최대 3개까지만 보이게 제한
          if (newList.length > 3) newList.pop();

          // 첫 페이지를 새 목록으로 교체(불변성 유지)
          updatedPages[0] = {
            ...firstPage,
            list: newList,
          };

          // 변경된 pages를 반환하여 캐시 갱신
          return { ...oldData, pages: updatedPages };
        }
      );

      /**
       * 2) 서버 데이터 재검증
       *    - 즉시 반영한 캐시가 "낙관적 상태"가 되지 않도록
       *      서버의 진짜 최신 데이터로 동기화합니다.
       *    - invalidate 후 백그라운드에서 refetch가 트리거됨
       */
      queryClient.invalidateQueries({ queryKey: ['comments', epigramId] });
    },
  });
}
