'use client';

import Image from 'next/image';
import { MouseEvent } from 'react';
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
} from '@/components/ui/alert-dialog';
import { toast } from 'react-toastify';

type Props = {
  onDelete: () => Promise<void> | void;
  isDeleting?: boolean;
  // 제어 모드용 (선택)
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  // 비제어 트리거 모드로도 쓸 수 있게 유지
  children?: React.ReactNode;
};

export default function DeleteEpigramDialog({
  onDelete,
  isDeleting = false,
  open,
  onOpenChange,
  children,
}: Props) {
  const handleDelete = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // 혹시 폼 안일 때 제출 방지
    if (isDeleting) return;
    try {
      await onDelete(); // mutateAsync 대기 가능
      onOpenChange?.(false); // 성공 시 닫기 (네비게이션 되면 자동 unmount)
    } catch (err) {
      console.error('삭제 실패:', err);
      // 실패 시에는 열어둔 채로 토스트 등 안내 가능
      toast.error('삭제 실패');
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {children && <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>}

      <AlertDialogContent
        className='rounded-3xl lg:w-[452px] md:w-[372px] w-[320px] p-6'
        // 메뉴의 document.mousedown 외부클릭 핸들러로 전파되지 않도록
        onMouseDownCapture={(e) => e.stopPropagation()}
      >
        <AlertDialogHeader className='text-center'>
          <div className='my-4 grid place-items-center'>
            <span className='relative lg:size-[56px] size-[44px]'>
              <Image src='/images/warning_icon.png' alt='warning icon' fill />
            </span>
          </div>

          <AlertDialogTitle className='text-center lg:text-2xl md:text-xl text-base font-semibold text-black-700'>
            게시물을 삭제하시겠어요?
          </AlertDialogTitle>
          <AlertDialogDescription className='text-center lg:text-lg md:text-base text-sm text-gray-400'>
            게시물은 삭제 후 복구할 수 없어요.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className='mt-6 flex gap-3'>
          <AlertDialogCancel
            type='button'
            className='lg:h-[58px] h:[48px] lg:text-xl text-base flex-1 rounded-xl bg-blue-200 text-black-700 hover:bg-gray-200'
          >
            취소
          </AlertDialogCancel>
          <AlertDialogAction
            type='button'
            onClick={handleDelete}
            disabled={isDeleting}
            className={
              isDeleting
                ? 'opacity-50 cursor-not-allowed lg:h-[58px] h-[48px] lg:text-xl text-base flex-1 rounded-xl bg-blue-900 text-blue-100 hover:bg-blue-950'
                : 'lg:h-[58px] h-[48px] lg:text-xl text-base flex-1 rounded-xl bg-blue-900 text-blue-100 hover:bg-blue-950'
            }
          >
            {isDeleting ? '삭제 중...' : '삭제하기'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
