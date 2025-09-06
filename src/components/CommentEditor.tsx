// 댓글 수정 모드 UI (textarea + 공개/비공개 토글 + 저장/취소 버튼)
import { useState, useEffect } from 'react';
import { List } from '@/types/comments';
import { toast } from 'react-toastify';
import { UseMutationResult } from '@tanstack/react-query';
import { useCommentEditStore } from '@/stores/commentEditStore';

export function CommentEditor({
  comment,
  updateMutation,
}: {
  comment: List;
  updateMutation: UseMutationResult<any, unknown, any, unknown>;
}) {
  const { stop } = useCommentEditStore();
  const [editContent, setEditContent] = useState('');
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
        className='border p-2 text-xl text-black-500 rounded-md min-h-[80px] w-full'
      />
      <div>
        {/* 글자 수 카운트 */}
        <div
          className={`text-sm text-right ${
            editContent.length > 100 ? 'text-red-500' : 'text-gray-500'
          }`}
        >
          {editContent.length}/100
        </div>

        {/* 공개/비공개 토글 */}
        <label className='inline-flex items-center cursor-pointer'>
          <input
            type='checkbox'
            checked={isPrivate}
            onChange={() => setIsPrivate((prev) => !prev)}
            className='sr-only peer'
          />
          <div
            className="relative w-11 h-6 bg-gray-200 rounded-full 
              peer peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 
              after:content-[''] after:absolute after:top-[2px] after:start-[2px]
              after:bg-white after:border-gray-300 after:border after:rounded-full 
              after:h-5 after:w-5 after:transition-all
              peer-checked:bg-blue-600 peer-checked:after:translate-x-full"
          ></div>
          <span className='ms-3 text-sm font-medium text-gray-900'>
            {isPrivate ? '비공개' : '공개'}
          </span>
        </label>

        {/* 저장/취소 버튼 */}
        <div>
          <button
            onClick={() => {
              if (editContent.trim().length > 100) {
                toast.error('댓글은 100자 이내로 입력해주세요.');
                return;
              }
              updateMutation.mutate({
                id: comment.id,
                content: editContent.trim(),
                isPrivate,
              });
            }}
            className='text-sm text-blue-500'
          >
            저장
          </button>
          <button onClick={stop} className='text-sm text-gray-500'>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
