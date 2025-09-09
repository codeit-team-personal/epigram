'use client';

import { UseFormReturn } from 'react-hook-form';
import { useState } from 'react';
import { z } from 'zod';
import {
  CreateSchema,
  singleTagSchema,
  fullTagsSchema,
} from '@/schemas/createSchema';
/**
- singleTagSchema → 단일 태그 유효성 (길이, 공백 등)
- prev.some(...) → 현재까지 입력된 태그와 중복 방지
- fullTagsSchema → 전체 배열 조건 (개수 3개 제한, 전체 중복 여부 등)
*/

/**
컴포넌트 props
    - title: 폼 제목
    - form: RHF의 훅 반환값
    - onSubmit(data): 제출 핸들러
    - isSubmitting: 제출 중 버튼 비활성화
    - tags: 현재 태그 배열(상위에서 관리)
    - onAddTag(tag): 태그 하나를 상위 상태에 커밋
    - onRemoveTag: 삭제 핸들러 
 */
type EpigramFormLayoutProps = {
  title: string;
  form: UseFormReturn<CreateSchema>;
  onSubmit: (data: CreateSchema) => void;
  isSubmitting: boolean;
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
};


export default function EpigramFormLayout({
  title,
  form,
  onSubmit,
  isSubmitting,
  tags,
  onAddTag,
  onRemoveTag,
}: EpigramFormLayoutProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const authorType = watch('authorType');
  const [tagInput, setTagInput] = useState('');
  const [tagError, setTagError] = useState<string | null>(null);

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 일부 환경(파폭 등) 방어
    if (e.key === 'Process') return;

    // e.key !== 'Enter' 엔터가 아니면 무시.
    // Input Method Editor(IME) 조합 중(isComposing === true)이면 무시 → 조합 확정 전 엔터 입력을 걸러서 중복/오작동 방지.
    // isComposing을 확인하면 입력이 조합 중인 상태인지 파악하여 불필요한 keydown 이벤트를 무시함
    if (e.key !== 'Enter' || (e.nativeEvent as any).isComposing) return;

    e.preventDefault();
    setTagError(null);

    // 1) 단일 태그 검증
    //singleTagSchema.safeParse(tagInput)
    //현재 인풋 값이 “단일 태그로서 유효한가” 1차 검증(Zod).
    //실패 시 첫 번째 에러 메시지를 setTagError(...)로 표시하고 종료.
    const single = singleTagSchema.safeParse(tagInput);
    if (!single.success) {
      setTagError(
        single.error.issues[0]?.message ?? '태그 형식이 올바르지 않습니다.'
      );
      return;
    }

    //스키마 통과한 값을 공백 제거.
    const trimmed = single.data.trim();

    //??는 nullish coalescing operator (널 병합 연산자)
    //왼쪽 값이 null 또는 undefined일 때만 오른쪽 값을 대신 사용
    //tags가 정상적인 배열이면: 그대로 tags를 사용 or null이나 undefined라면: 대신 빈 배열 []을 사용
    const prev = tags ?? [];

    // 중복 방지: 대소문자 무시
    // 이미 fullTagsSchema에서도 중복 체크를 하고 있음.
    // fullTagsSchema는 **“전체 배열 상태”**를 대상으로 한 최종 검증
    // 여기 .some() 검사는 태그 입력 단계에서 바로 피드백을 주기 위한 것
    // 사용자가 Enter 누른 직후 바로 "이미 있는 태그예요"라고 알려주기 위해서

    //.some() → 배열에서 조건을 만족하는 원소가 하나라도 있으면 true
    if (prev.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      setTagError('이미 추가된 태그예요.');
      return;
    }

    const next = [...prev, trimmed];

    // 2) 전체 배열 검증(개수/중복/길이 등)
    const full = fullTagsSchema.safeParse(next);
    if (!full.success) {
      setTagError(
        full.error.issues[0]?.message ?? '태그 목록이 유효하지 않습니다.'
      );
      return;
    }

    // 3) 검증 통과 후에만 커밋(한 번만 호출)
    onAddTag(trimmed);

    //RHF 값에 반영
    setValue('tags', next, { shouldValidate: true });

    // 4) 입력/오류 상태 정리
    setTagInput('');
    setTagError(null);
  };

  return (
    <div className='max-w-xl mx-auto p-6'>
      <h1 className='text-xl font-semibold mb-4'>{title}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {/* 내용 */}
        <div>
          <label htmlFor='content' className='block font-medium mb-1'>
            내용 <span className='text-red-500'>*</span>
          </label>
          <textarea
            id='content'
            {...register('content')}
            placeholder='500자 이내로 입력해주세요.'
            maxLength={500}
            className={`w-full border rounded-lg p-2 ${
              errors.content ? 'border-red-500' : ''
            }`}
            rows={4}
          />
          <p className='text-sm text-gray-500 text-right'>
            {watch('content')?.length || 0}/500
          </p>
          {errors.content && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.content.message}
            </p>
          )}
        </div>

        {/* 저자 */}
        <div>
          <label className='block font-medium mb-1'>
            저자 <span className='text-red-500'>*</span>
          </label>
          <div className='flex gap-4'>
            <label htmlFor='author-direct' className='flex items-center gap-1'>
              <input
                id='author-direct'
                type='radio'
                value='직접 입력'
                {...register('authorType')}
              />
              직접 입력
            </label>
            <label htmlFor='author-unknown' className='flex items-center gap-1'>
              <input
                id='author-unknown'
                type='radio'
                value='알 수 없음'
                {...register('authorType')}
              />
              알 수 없음
            </label>
            <label htmlFor='author-self' className='flex items-center gap-1'>
              <input
                id='author-self'
                type='radio'
                value='본인'
                {...register('authorType')}
              />
              본인
            </label>
          </div>
          {authorType === '직접 입력' && (
            <input
              type='text'
              {...register('authorName')}
              placeholder='저자 이름 입력'
              className={`mt-2 w-full border rounded-lg p-2 ${
                errors.authorName ? 'border-red-500' : ''
              }`}
            />
          )}
          {authorType === '직접 입력' && errors.authorName && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.authorName.message}
            </p>
          )}
        </div>

        {/* 출처 */}
        <div>
          <label htmlFor='referenceInput' className='block font-medium mb-1'>
            출처
          </label>
          <input
            id='referenceInput'
            type='text'
            {...register('referenceTitle')}
            placeholder='출처 제목 입력'
            className='w-full border rounded-lg p-2 mb-2'
          />
          <input
            type='text'
            {...register('referenceUrl')}
            placeholder='URL (ex. https://www.website.com)'
            className='w-full border rounded-lg p-2'
          />
        </div>

        {/* 태그 */}
        <div>
          <label htmlFor='tagInput' className='block font-medium mb-1'>
            태그
          </label>
          <input
            id='tagInput'
            placeholder='입력하여 태그 작성 (최대 10자)'
            type='text'
            value={tagInput}
            onChange={(e) => {
              setTagInput(e.target.value);
              if (tagError) setTagError(null);
            }}
            onKeyDown={handleTagInput}
            className={`w-full border rounded-lg p-2 ${
              tagError ? 'border-red-500' : ''
            }`}
          />
          {tagError && <p className='text-red-500 text-sm mt-1'>{tagError}</p>}
          <div className='flex flex-wrap gap-2 mt-2'>
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className='px-2 py-1 text-sm bg-gray-200 rounded-full'
              >
                {tag}
                <button
                  type='button'
                  onClick={() => {
                    onRemoveTag(tag);

                    // RHF 값 갱신
                    setValue(
                      'tags',
                      tags.filter((t) => t !== tag),
                      { shouldValidate: true }
                    );
                  }}
                  className='text-gray-600 hover:text-red-500'
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* 제출 버튼 */}
        <button
          type='submit'
          disabled={isSubmitting}
          className='w-full bg-blue-500 text-white py-2 rounded-lg disabled:opacity-50'
        >
          작성 완료
        </button>
      </form>
    </div>
  );
}
