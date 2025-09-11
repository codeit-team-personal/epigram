"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import CommentsCard from "@/components/CommentCard";
import { getEpigramDetailComments } from "@/lib/api";
import { useCommentList } from "@/hooks/useCommentList";
import { useCommentMutation } from "@/hooks/useCommentMutation";
import { toast } from "react-toastify";
import { CommentAvatar } from "@/components/CommentAvatar";
import { useAuthStore } from "@/stores/authStore";
import Image from "next/image";

export default function EpiDetailCommentList() {
  const params = useParams();
  const epigramId = Number(params.id);

  const {
    comments,
    totalCount,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCommentList(epigramId);

  const mutation = useCommentMutation(epigramId);

  const [content, setContent] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [active, setActive] = useState(false);

  const { user } = useAuthStore();

  // 댓글 작성 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (content.length > 100) {
      toast.error("댓글은 100자 이내로 입력해주세요.");
      return;
    }

    mutation.mutate(
      { epigramId, isPrivate, content },
      {
        onSuccess: () => {
          setContent("");
          setActive(false);
          toast.success("댓글이 등록되었습니다.");
        },
      }
    );
  };

  return (
    <div className='lg:w-[640px] md:w-[384px] w-[312px] mx-auto py-10'>
      <div className='py-4'>
        <div className='font-semibold mb-2 lg:text-xl text-base'>
          댓글 ({totalCount})
        </div>
        <form onSubmit={handleSubmit} className='space-y-2 lg:py-8 py-4'>
          <div className='flex'>
            <div className='mt-2 mr-4 w-[48px] h-[48px] rounded-full overflow-hidden flex-shrink-0'>
              <CommentAvatar nickname={user!.nickname} image={user!.image} />
            </div>
            <div className='flex-1'>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onFocus={() => setActive(true)}
                className='w-full rounded-md border border-gray-300 outline p-2 outline-line-200 focus:outline-black-600 placeholder:text-blue-400'
                rows={3}
                placeholder='100자 이내로 입력해주세요.'
              />
              {active && (
                <div className='my-2 flex gap-2 items-center justify-between'>
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

                  {/* 글자 수 카운트 표시 */}
                  <div className='flex justify-center items-center gap-2'>
                    <div
                      className={`text-sm text-right ${
                        content.length > 100 ? "text-red-500" : "text-gray-500"
                      }`}
                    >
                      {content.length}/100
                    </div>
                    <button
                      type='submit'
                      className='lg:px-4 md:px-3 px-2 py-1 lg:text-base text-xs bg-black-500 text-white rounded cursor-pointer'
                      disabled={mutation.isPending}
                    >
                      저장
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* 댓글 리스트 */}
      {comments.map((comment) => (
        <CommentsCard
          key={comment.id}
          comment={comment}
          queryKey={["comments", epigramId]}
          onFetchOne={(cursor) =>
            getEpigramDetailComments({ epigramId, limit: 1, cursor })
          }
        />
      ))}
      {hasNextPage && (
        <div className='flex justify-center mt-4'>
          <Button
            className='flex items-center gap-2 rounded-full border border-line-200 bg-transparent px-4 py-2 lg:text-xl text-sm text-blue-500 hover:bg-gray-50 lg:w-[238px] lg:h-[56px] w-[153px] h-[48px]'
            variant='outline'
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            <span>{isFetchingNextPage ? "로딩중..." : "댓글 더보기"}</span>
          </Button>
        </div>
      )}

      {comments.length === 0 && (
        <div className='flex flex-col justify-center items-center lg:w-[640px] lg:h-[488px] md:w-[384px] w-[312px] h-[304px] '>
          <span className='relative lg:size-[140px] size-[96px] '>
            <Image src={"/images/no_comments.png"} alt='no_comments' fill />
          </span>
          <h2 className='lg:text-xl text-sm font-normal text-center lg:mt-10 mt-5 mb-30 text-black-600'>
            아직 댓글이 없어요!
            <br />
            댓글을 달고 다른 사람들과 교류해보세요.
          </h2>
        </div>
      )}
    </div>
  );
}
