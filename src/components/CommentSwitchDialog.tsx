// 다른 댓글 수정 시 경고 다이얼로그
'use client';

import Image from 'next/image';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function CommentSwitchDialog({
  open,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <AlertDialogContent className='rounded-3xl lg:w-[452px] md:w-[372px] w-[320px] p-6'>
        <AlertDialogHeader className='text-center'>
          <div className='my-4 grid place-items-center'>
            <span className='relative lg:size-[56px] size-[44px]'>
              <Image src='/images/warning_icon.png' alt='warning icon' fill />
            </span>
          </div>
          <AlertDialogTitle className='text-center lg:text-2xl md:text-xl text-base font-semibold text-black-700'>
            다른 댓글을 수정하시겠습니까?
          </AlertDialogTitle>
          <AlertDialogDescription className='text-center lg:text-lg md:text-base text-sm text-gray-400'>
            현재 수정 중인 내용은 저장되지 않습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='mt-6 flex gap-3'>
          <AlertDialogCancel
            onClick={onCancel}
            className='lg:h-[58px] h-[48px] lg:text-xl text-base flex-1 rounded-xl bg-blue-200 text-black-700 hover:bg-gray-200'
          >
            취소
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className='lg:h-[58px] h-[48px] lg:text-xl text-base flex-1 rounded-xl bg-blue-900 text-blue-100 hover:bg-blue-950'
          >
            확인
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
