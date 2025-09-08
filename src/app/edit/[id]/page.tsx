'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

import EpigramFormLayout from '@/components/EpigramFormLayout';
import { useCreateForm } from '@/hooks/useCreateForm';
import { CreateSchema } from '@/schemas/createSchema';
import { getEpigramDetail, updateEpigram } from '@/lib/api';

export default function Edit() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const form = useCreateForm();
  const [tags, setTags] = useState<string[]>([]);

  // 상세 조회
  const { data, isLoading } = useQuery({
    queryKey: ['epigramDetail', id],
    queryFn: () => getEpigramDetail(Number(id)),
  });

  // PATCH 요청
  const mutation = useMutation({
    mutationFn: (payload: Parameters<typeof updateEpigram>[1]) =>
      updateEpigram(id, payload),
    onSuccess: (data) => {
      toast.success('에피그램이 수정되었습니다.');
      router.push(`/detail/${data.id}`);
    },
    onError: (err: unknown) => {
      const e = err as AxiosError<any>;
      const msg = Array.isArray(e.response?.data?.message)
        ? e.response?.data?.message.join('\n')
        : e.response?.data?.message ||
          e.message ||
          '수정 중 오류가 발생했습니다.';
      toast.error(msg);
    },
  });

  // 기존 데이터 → form에 세팅
  useEffect(() => {
    if (data) {
      const tagStrings = (data.tags || []).map((t) => t.name);

      form.reset({
        content: data.content,
        authorType:
          data.author === '알 수 없음'
            ? '알 수 없음'
            : data.author === '본인'
              ? '본인'
              : '직접 입력',
        authorName:
          data.author !== '알 수 없음' && data.author !== '본인'
            ? data.author
            : '',
        referenceTitle: data.referenceTitle || '',
        referenceUrl: data.referenceUrl || '',
        tags: tagStrings, // ← string[] 전달
      });

      setTags(tagStrings); // 로컬 상태도 string[]으로 세팅
    }
  }, [data, form]);

  const handleAddTag = (tag: string) => {
    const lower = tag.toLowerCase();
    const isDup = tags.some((t) => t.toLowerCase() === lower);
    if (!isDup && tags.length < 3) {
      const next = [...tags, tag];
      setTags(next);
      form.setValue('tags', next, { shouldValidate: true });
    }
  };

  const handleRemoveTag = (tag: string) => {
    const next = tags.filter((t) => t !== tag);
    setTags(next);
    form.setValue('tags', next, { shouldValidate: true });
  };

  const handleSubmit = (data: CreateSchema) => {
    const payload = {
      content: data.content,
      author:
        data.authorType === '알 수 없음'
          ? '알 수 없음'
          : data.authorType === '본인'
            ? '본인'
            : data.authorName || '무명',
      referenceTitle: data.referenceTitle,
      referenceUrl: data.referenceUrl?.trim() || 'https://example.com/...',
      tags,
    };

    mutation.mutate(payload);
  };

  if (isLoading) {
    return <p className='p-6'>로딩 중...</p>;
  }

  return (
    <EpigramFormLayout
      title='에피그램 수정'
      form={form}
      onSubmit={handleSubmit}
      isSubmitting={mutation.isPending}
      tags={tags}
      onAddTag={handleAddTag}
      onRemoveTag={handleRemoveTag}
    />
  );
}
