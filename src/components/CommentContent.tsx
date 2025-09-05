// 수정 전 댓글 표시 (닉네임, 시간, 내용)
import { List } from '@/types/comments';
import { formatAgo } from '@/util/date';

export function CommentContent({ comment }: { comment: List }) {
  return (
    <div>
      <p className='flex items-center gap-2 font-normal text-black-300 text-base'>
        <span>{comment.writer.nickname}</span>
        <span>{formatAgo(comment.createdAt, 'ko')}</span>
      </p>
      <p className='text-black-550 font-normal text-xl mt-3 leading-8'>
        {comment.content}
      </p>
    </div>
  );
}
