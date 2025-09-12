// 댓글 수정/삭제 관련 mutation 로직을 한 곳에 모아둔 커스텀 훅
import {
  useMutation,
  useQueryClient,
  InfiniteData,
} from '@tanstack/react-query';
import { updateComment, deleteComment } from '@/lib/api';
import { toast } from 'react-toastify';
import { useCommentEditStore } from '@/stores/commentEditStore';
import { Comments as CommentsType } from '@/types/comments';
import { useAuthStore } from '@/stores/authStore';

type CommentsInfiniteData = InfiniteData<CommentsType>;

export function useCommentActions(
  queryKey: (string | number)[],
  onFetchOne?: (cursor: number) => Promise<CommentsType>
) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { stop, editingId } = useCommentEditStore();

  // 댓글 수정 mutation
  const updateMutation = useMutation({
    mutationFn: updateComment,
    onSuccess: (updated) => {
      // 낙관적 업데이트
      queryClient.setQueryData<CommentsInfiniteData>(queryKey, (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: CommentsType) => ({
            ...page,
            list: page.list.map((c) => (c.id === updated.id ? updated : c)),
          })),
        };
      });
      // 편집 종료
      stop();
      // 서버와 동기화

      queryClient.refetchQueries({ queryKey, exact: true, type: 'active' });
      toast.success('댓글이 성공적으로 수정되었습니다');
    },
    onError: () => toast.error('댓글 수정에 실패했습니다'),
  });

  // 댓글 삭제 mutation
  const deleteMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: async (_, id) => {
      // 낙관적 삭제
      queryClient.setQueryData<CommentsInfiniteData>(queryKey, (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: CommentsType) => ({
            ...page,
            list: page.list.filter((c) => c.id !== id),
          })),
        };
      });

      // 1개 보충 (페이징 유지용)
      const oldData = queryClient.getQueryData<CommentsInfiniteData>(queryKey);
      const lastPage = oldData?.pages[oldData.pages.length - 1];
      if (onFetchOne && lastPage?.nextCursor) {
        const newPage = await onFetchOne(lastPage.nextCursor);
        queryClient.setQueryData<CommentsInfiniteData>(queryKey, (old) => {
          if (!old) return old;
          const updatedPages = [...old.pages];
          const last = updatedPages[updatedPages.length - 1];
          updatedPages[updatedPages.length - 1] = {
            ...last,
            list: [...last.list, ...newPage.list],
            nextCursor: newPage.nextCursor,
          };
          return { ...old, pages: updatedPages };
        });
      }

      // 삭제 반영 새로고침
      queryClient.invalidateQueries({ queryKey });

      // MyHistory 페이지 반영
      if (user) {
        queryClient.invalidateQueries({ queryKey: ['myComments', user.id] });
        // 전체 댓글(메인 리스트)도 필요하면
        queryClient.invalidateQueries({ queryKey: ['comments'] });
      }

      // 편집 중인 댓글이 삭제됐다면 종료
      if (editingId === id) stop();
      toast.success('댓글이 삭제되었습니다');
    },
    onError: () => toast.error('댓글 삭제에 실패했습니다'),
  });

  return { updateMutation, deleteMutation };
}
