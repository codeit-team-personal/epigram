// CommentUserProfileDialog.tsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CommentAvatar } from './CommentAvatar';
import { List } from '@/types/comments';

export function CommentUserProfileDialog({ comment }: { comment: List }) {
  return (
    <Dialog >
      {/* 아바타 클릭 = 다이얼로그 열기 */}
      <DialogTrigger asChild>
        <div className='mt-2 mr-4 w-[48px] h-[48px] rounded-full overflow-hidden flex-shrink-0 cursor-pointer'>
          <CommentAvatar
            nickname={comment.writer.nickname}
            image={comment.writer.image}
          />
        </div>
      </DialogTrigger>

      {/* 다이얼로그 내용 (overlay 클릭/ESC로 닫힘) */}
      <DialogContent className=' rounded-3xl lg:w-[360px] md:w-[372px] w-[320px] p-6'>

        <DialogHeader className='text-center space-y-4'>
          <DialogTitle className='mt-10 mx-auto'>
            <CommentAvatar
              nickname={comment.writer.nickname}
              image={comment.writer.image}
            />
          </DialogTitle>
          <DialogTitle className='text-center lg:text-xl text-lg  font-semibold text-black-400'>
            {comment.writer.nickname}
          </DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
