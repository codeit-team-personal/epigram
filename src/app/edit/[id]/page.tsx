'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

import EpigramFormLayout from '@/components/EpigramFormLayout';
import { getEpigramDetail, updateEpigram } from '@/lib/api';
import { useEpigramForm } from '@/hooks/useEpigramForm';

export default function Edit() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useParams();
  const id = Number(params.id);

  const { form, tags, setTags, handleAddTag, handleRemoveTag, buildPayload } =
    useEpigramForm();

  const { data, isLoading } = useQuery({
    queryKey: ['epigramDetail', id],
    queryFn: () => getEpigramDetail(id),
  });

  const mutation = useMutation({
    mutationFn: (payload: ReturnType<typeof buildPayload>) =>
      updateEpigram(id, payload),
    onSuccess: (data) => {
      toast.success('에피그램이 수정되었습니다.');
      //캐시 무효화 → MyHistory에서 자동으로 최신 데이터 가져옴
      queryClient.invalidateQueries({ queryKey: ['myEpigrams'] });
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
    if (!data) return;

    // 태그 문자열만 뽑기
    //data.tags가 있으면 각 태그 객체에서 name만 뽑아서 **문자열 배열(string[])**로 만듬
    //data.tags가 없으면 빈 배열 []로 처리
    const tagStrings = (data.tags || []).map((t) => t.name);

    // 작성자 타입과 이름 분기
    let authorType: '알 수 없음' | '본인' | '직접 입력' = '직접 입력';
    let authorName = '';

    if (data.author === '알 수 없음') {
      authorType = '알 수 없음';
    } else if (data.author === '본인') {
      authorType = '본인';
    } else {
      authorName = data.author;
    }

    // 폼 초기화
    form.reset({
      content: data.content,
      authorType,
      authorName,
      referenceTitle: data.referenceTitle || '',
      referenceUrl: data.referenceUrl || '',
      tags: tagStrings, // ← string[] 전달, tags는 위에서 만든 문자열 배열(tagStrings)을 넣음
    });

    // 로컬 상태도 세팅
    // 로컬 상태도 string[]으로 세팅,
    // 폼에는 tags를 넣었지만, 컴포넌트 내부에서 태그를 별도로 로컬 상태로 관리할 수도 있음
    setTags(tagStrings);
  }, [data, form, setTags]);

  if (isLoading) return <p className='p-6'>로딩 중...</p>;

  return (
    <EpigramFormLayout
      title='에피그램 수정'
      form={form}
      onSubmit={(data) => mutation.mutate(buildPayload(data))}
      isSubmitting={mutation.isPending}
      tags={tags}
      onAddTag={handleAddTag}
      onRemoveTag={handleRemoveTag}
    />
  );
}
