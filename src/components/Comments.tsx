'use client';

import { Plus } from 'lucide-react';
import { Button } from './ui/button';
import CommentsCard from './CommentCard';
import { Comments as CommentsType } from '@/types/comments';
import { getComments } from '@/lib/api';
import useInfiniteList from '@/hooks/useInfiniteList';
import { Skeleton } from '@/components/ui/skeleton';

export default function Comments({ title }: { title: string }) {
  const {
    items: comments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteList<CommentsType['list'][number], CommentsType>({
    key: ['comments'],
    fetchPage: (cursor) => getComments({ limit: 4, cursor }),
    enabled: true,
    initialCursor: null,
  });

 if (isLoading || isError) {
   return (
     <div className='my-16 md:my-24 lg:my-30 mx-auto w-[312px] md:w-[384px] lg:w-[640px]'>
       <h1 className='text-black-600 text-lg md:text-xl lg:text-2xl font-semibold mb-6 md:mb-8 lg:mb-10'>
         {isError ? '댓글을 불러오는 중 문제가 발생했어요.' : title}
       </h1>

       {/* 댓글 카드 4개 skeleton */}
       {Array.from({ length: 4 }).map((_, i) => (
         <div
           key={i}
           className='border-t border-gray-200 px-1 md:px-2 lg:px-6 py-6 md:py-6 lg:py-11'
         >
           <div className='flex items-start gap-3 md:gap-4'>
             {/* 동그란 프로필 */}
             <Skeleton className='h-14 w-14 md:h-14 md:w-14 lg:h-14 lg:w-14 rounded-full' />

             {/* 내용 */}
             <div className='flex-1 min-w-0'>
               <div className='flex items-center gap-2'>
                 <Skeleton className='h-4 w-24 md:w-32' />
                 <Skeleton className='h-3 w-20' />
               </div>
               <Skeleton className='mt-1 lg:mt-3 h-4 w-11/12 md:w-11/12' />
               <Skeleton className='mt-1 lg:mt-3 h-4 w-9/12 md:w-9/12' />
             </div>
           </div>
         </div>
       ))}

       {/* 더보기 버튼 skeleton */}
       <Skeleton className='h-10 lg:h-15 w-30 lg:w-55 mx-auto rounded-full mt-4' />
     </div>
   );
 }
  return (
    <div className='my-16 md:my-24 lg:my-30 mx-auto w-[312px] md:w-[384px] lg:w-[640px]'>
      <h1 className='text-black-600 text-lg md:text-xl lg:text-2xl font-semibold mb-6 md:mb-8 lg:mb-10'>
        {title}
      </h1>

      {comments.map((comment) => (
        <CommentsCard
          key={comment.id}
          comment={comment}
          queryKey={['comments']}
          onFetchOne={(cursor) => getComments({ limit: 1, cursor })}
        />
      ))}

      {hasNextPage && (
        <div className='flex justify-center mt-4 cursor-pointer'>
          <Button
            variant='plus'
            size='plus'
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            <Plus className='text-blue-500 size-4 lg:size-6' />
            <div className='text-blue-500 text-sm lg:text-xl  '>
              {isFetchingNextPage ? '댓글 로딩중' : '댓글 더보기'}
            </div>
          </Button>
        </div>
      )}
    </div>
  );
}
