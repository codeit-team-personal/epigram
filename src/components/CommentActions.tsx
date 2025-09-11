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
import Image from "next/image";

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

        <AlertDialogContent className='rounded-3xl lg:w-[452px]  md:w-[372px]  w-[320px]  p-6'>
          <AlertDialogHeader className='text-center'>
            <div className='my-4 grid place-items-center'>
              <span className='relative lg:size-[56px] size-[44px]'>
                <Image
                  src={"/images/warning_icon.png"}
                  alt='warning icon'
                  fill
                />
              </span>
            </div>

            <AlertDialogTitle className='text-center lg:text-2xl md:text-xl text-base font-semibold text-black-700'>
              댓글을 삭제하시겠어요?
            </AlertDialogTitle>
            <AlertDialogDescription className='text-center lg:text-lg md:text-base text-sm text-gray-400'>
              댓글은 삭제 후 복구할 수 없어요.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className='mt-6 flex gap-3 '>
            <AlertDialogCancel className='lg:h-[58px] h-[48px] lg:text-xl text-base flex-1 rounded-xl bg-blue-200 text-black-700 hover:bg-gray-200'>
              취소
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className='lg:h-[58px] h-[48px] lg:text-xl text-base flex-1 rounded-xl bg-blue-900 text-blue-100 hover:bg-blue-950'
            >
              삭제하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
