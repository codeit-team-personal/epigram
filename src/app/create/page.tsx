'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

import EpigramFormLayout from '@/components/EpigramFormLayout';
import { createEpigram } from '@/lib/api';
import { useEpigramForm } from '@/hooks/useEpigramForm';

export default function Create() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { form, tags, handleAddTag, handleRemoveTag, buildPayload, setTags } =
    useEpigramForm();

  const mutation = useMutation({
    mutationFn: createEpigram,
    onSuccess: (data) => {
      toast.success('에피그램이 업로드 되었습니다.');
      //캐시 무효화 → MyHistory에서 자동으로 최신 데이터 가져옴
      queryClient.invalidateQueries({ queryKey: ['myEpigrams'] });
      form.reset(); // 폼 초기화
      setTags([]); // 태그 초기화
      router.push(`/detail/${data.id}`);
    },
    onError: (err: unknown) => {
      const e = err as AxiosError<any>;
      const msg = Array.isArray(e.response?.data?.message)
        ? e.response?.data?.message.join('\n')
        : e.response?.data?.message ||
          e.message ||
          '업로드 중 오류가 발생했습니다.';
      toast.error(msg);
    },
  });

  return (
    <EpigramFormLayout
      title='에피그램 만들기'
      form={form}
      onSubmit={(data) => mutation.mutate(buildPayload(data))}
      isSubmitting={mutation.isPending}
      tags={tags}
      onAddTag={handleAddTag}
      onRemoveTag={handleRemoveTag}
    />
  );
}
