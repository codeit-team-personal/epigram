"use client";
import { useAuthStore } from "@/stores/authStore";
import { useCommentEditStore } from "@/stores/commentEditStore";
import { List, Comments as CommentsType } from "@/types/comments";
import { CommentAvatar } from "./CommentAvatar";
import { CommentContent } from "./CommentContent";
import { CommentEditor } from "./CommentEditor";
import { CommentActions } from "./CommentActions";
import { CommentSwitchDialog } from "./CommentSwitchDialog";
import { useCommentActions } from "@/hooks/useCommentActions";

export default function CommentsCard({
  comment,
  queryKey,
  onFetchOne,
}: {
  comment: List;
  queryKey: (string | number)[];
  onFetchOne: (cursor: number) => Promise<CommentsType>;
}) {
  const { user } = useAuthStore();
  const { editingId, tryStart, stop, confirm, cancel, showDialog } =
    useCommentEditStore();
  const isEditing = editingId === comment.id;


  const { updateMutation, deleteMutation } = useCommentActions(
    queryKey,
    onFetchOne
  );

  return (
    <div className='flex relative p-2 border-t border-line-200 group py-10 justify-center'>
      <div className='mt-2 mr-4 w-[48px] h-[48px] rounded-full overflow-hidden flex-shrink-0'>
        <CommentAvatar
          nickname={comment.writer.nickname}
          image={comment.writer.image}
        />
      </div>

      <div className='w-[530px]'>
        {isEditing ? (
          <CommentEditor comment={comment} updateMutation={updateMutation} />
        ) : (
          <CommentContent comment={comment} />
        )}
      </div>

      {/* 본인 댓글일 때만 수정/삭제 버튼 표시 */}
      {Number(user?.id) === comment.writer.id && !isEditing && (
        <CommentActions
          commentId={comment.id}
          onEdit={() => tryStart(comment.id)}
          onDelete={() => deleteMutation.mutate(comment.id)}
        />
      )}

      {/* 다른 댓글 수정 전환 시 경고 다이얼로그 */}
      {isEditing && (
        <CommentSwitchDialog
          open={showDialog}
          onCancel={cancel}
          onConfirm={confirm}
        />
      )}
    </div>
  );
}
