'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { List } from '@/types/comments';
import { createComment } from '@/lib/api';

export function useCommentMutation(epigramId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createComment,
    onSuccess: (newComment: List) => {
      queryClient.setQueryData(['comments', epigramId], (oldData: any) => {
        if (!oldData) {
          return {
            pages: [
              {
                list: [newComment],
                nextCursor: null,
                totalCount: 0,
              },
            ],
            pageParams: [null],
          };
        }

        const updatedPages = [...oldData.pages];
        const firstPage = updatedPages[0];

        const newList = [newComment, ...firstPage.list];
        if (newList.length > 3) newList.pop();

        updatedPages[0] = {
          ...firstPage,
          list: newList,
        };

        return { ...oldData, pages: updatedPages };
      });

      // 작성 직후 최신화
      queryClient.invalidateQueries({ queryKey: ['comments', epigramId] });
    },
  });
}
