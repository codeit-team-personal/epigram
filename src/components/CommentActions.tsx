// 수정/삭제 버튼 및 삭제 다이얼로그
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function CommentActions({
  commentId,
  onEdit,
  onDelete,
}: {
  commentId: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className='absolute right-2 top-8 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
      <Button
        className='lg:text-base md:text-sm text-xs'
        variant='comment'
        size='commnet'
        onClick={onEdit}
      >
        수정
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant='comment'
            size='commnet'
            className='text-state lg:text-base md:text-sm text-xs'
          >
            삭제
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말 삭제하시겠어요?</AlertDialogTitle>
            <AlertDialogDescription>
              댓글을 삭제하시겠어요?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete}>삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
