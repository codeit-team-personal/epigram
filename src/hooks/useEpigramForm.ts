import { useState, useEffect } from 'react';
import { useCreateForm } from '@/hooks/useCreateForm';
import { CreateSchema } from '@/schemas/createSchema';

export function useEpigramForm(initialTags: string[] = []) {
  const form = useCreateForm();
  const [tags, setTags] = useState<string[]>(initialTags);

  //**구조를 보면 중복 검사가 두 번**
  //page                 handleAddTag: UX 개선 (사용자 눈에 즉시 반응)
  //EpigramFormLayout    fullTagsSchema: 비즈니스 규칙의 최종 보증

  const handleAddTag = (tag: string) => {
    const lower = tag.toLowerCase();
    const isDup = tags.some((t) => t.toLowerCase() === lower);
    if (!isDup && tags.length < 3) {
      //기존 배열을 불변성 유지하며 복제 후 새 항목을 추가해 새 배열로 교체합니다(리렌더 유도)
      const next = [...tags, tag];
      setTags(next);
      //RHF에도 반영
      form.setValue('tags', next, { shouldValidate: true });
    }
  };

  const handleRemoveTag = (tag: string) => {
    const next = tags.filter((t) => t !== tag);
    setTags(next);
    //RHF에도 반영
    form.setValue('tags', next, { shouldValidate: true });
  };

  //react-hook-form이 넘겨주는 data를 받아서, 서버 API에 보낼 payload 만드는 함수
  //react-query의 mutation.mutate로 전송하는 역할
  const buildPayload = (data: CreateSchema) => ({
    content: data.content,
    author:
      data.authorType === '알 수 없음'
        ? '알 수 없음'
        : data.authorType === '본인'
          ? '본인'
          : data.authorName || '무명',
    referenceTitle: data.referenceTitle,
    referenceUrl: data.referenceUrl?.trim() || 'https://example.com/...',
    tags, //부모 컴포넌트가 관리하는 태그 배열을 그대로 포함
  });

  // authorType 변경 시 authorName 에러 자동 제거
  const authorType = form.watch('authorType');
  useEffect(() => {
    if (authorType !== '직접 입력') {
      form.clearErrors('authorName');
    }
  }, [authorType, form]);

  return { form, tags, setTags, handleAddTag, handleRemoveTag, buildPayload };
}
