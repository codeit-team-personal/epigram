

import { Comments as CommentsType } from '@/types/comments';

interface CommentsProps {
  data: CommentsType;
}

export default function Comments({ data }: CommentsProps) {
  return (
    <div>
      {data.list.map((comment) => (
        <div key={comment.id}>
          <p>{comment.content}</p>
          <span>{comment.writer.nickname}</span>
        </div>
      ))}
    </div>
  );
}
