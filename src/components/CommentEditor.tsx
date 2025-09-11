// 댓글 수정 모드 UI (textarea + 공개/비공개 토글 + 저장/취소 버튼)
import { useState, useEffect } from "react";
import { List } from "@/types/comments";
import { toast } from "react-toastify";
import { UseMutationResult } from "@tanstack/react-query";
import { useCommentEditStore } from "@/stores/commentEditStore";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type UpdateCommentVariables = {
  id: number;
  content: string;
  isPrivate: boolean;
};

export function CommentEditor({
  comment,
  updateMutation,
}: {
  comment: List;
  updateMutation: UseMutationResult<
    List,
    unknown,
    UpdateCommentVariables,
    unknown
  >;
}) {
  const { stop } = useCommentEditStore();
  const [editContent, setEditContent] = useState("");
  const [isPrivate, setIsPrivate] = useState<boolean>(
    comment.isPrivate ?? false
  );

  // 편집 시작 시 로컬 상태 초기화
  useEffect(() => {
    setEditContent(comment.content);
    setIsPrivate(comment.isPrivate ?? false);
  }, [comment]);

  return (
    <div className='mt-1'>
      <textarea
        value={editContent}
        onChange={(e) => setEditContent(e.target.value)}
        className='w-full rounded-md border border-gray-300 outline p-2 outline-line-200 focus:outline-black-600 placeholder:text-blue-400'
        placeholder='100자 이내로 입력해주세요.'
      />
      <div>
        <div className='my-2 flex gap-2 items-center justify-between'>
          {/* 공개/비공개 토글 */}
          <div className='flex items-center space-x-2'>
            <Label
              htmlFor='public-toggle'
              className={`lg:text-base md:text-sm text-xs cursor-pointer ${isPrivate ? "text-black-600" : "text-gray-400"}`}
            >
              {isPrivate ? "비공개" : "공개"}
            </Label>
            <Switch
              id='public-toggle'
              className='cursor-pointer'
              checked={isPrivate}
              onCheckedChange={() => setIsPrivate((prev) => !prev)}
            />
          </div>

          {/* 글자 수 카운트 */}
          <div className='flex justify-center items-center gap-2'>
            <div
              className={`text-sm text-right ${
                editContent.length > 100 ? "text-red-500" : "text-gray-500"
              }`}
            >
              {editContent.length}/100
            </div>

            {/* 저장/취소 버튼 */}
            <div className='flex gap-2'>
              <button
                onClick={() => {
                  if (editContent.trim().length > 100) {
                    toast.error("댓글은 100자 이내로 입력해주세요.");
                    return;
                  }
                  updateMutation.mutate({
                    id: comment.id,
                    content: editContent.trim(),
                    isPrivate,
                  });
                }}
                className='lg:px-4 md:px-3 px-2 py-1 lg:text-base text-xs bg-black-500 text-white rounded cursor-pointer'
              >
                저장
              </button>
              <button
                onClick={stop}
                className='lg:px-4 md:px-3 px-2 py-1 lg:text-base text-xs bg-blue-200 text-black-700 rounded cursor-pointer'
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
