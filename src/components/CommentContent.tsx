// 수정 전 댓글 표시 (닉네임, 시간, 내용)
import { List } from "@/types/comments";
import { formatAgo } from "@/util/date";

export function CommentContent({ comment }: { comment: List }) {
  return (
    <div>
      <p className='flex items-center gap-2 font-normal text-black-300 lg:text-base md:text-sm text-xs mt-2 lg:mt-0'>
        <span>{comment.writer.nickname}</span>
        <span>{formatAgo(comment.createdAt, "ko")}</span>
      </p>
      <p className='text-black-700 font-normal mt-2 lg:mt-3 lg:leading-8 lg:text-xl md:text-base text-sm'>
        {comment.content}
      </p>
    </div>
  );
}
