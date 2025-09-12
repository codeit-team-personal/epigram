"use client";

import Image from "next/image";
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

type Props = {
  onDelete: () => void;
  children: React.ReactNode; // Trigger로 쓸 버튼/요소
};

export default function DeleteEpigramDialog({ onDelete, children }: Props) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      <AlertDialogContent className='rounded-3xl lg:w-[452px] md:w-[372px] w-[320px] p-6'>
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
  );
}
