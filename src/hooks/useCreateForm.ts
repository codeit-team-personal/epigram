import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSchema, CreateSchema } from '@/schemas/createSchema';

export function useCreateForm() {
  return useForm<CreateSchema>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      content: '',
      authorType: '직접 입력',
      authorName: '',
      referenceTitle: '',
      referenceUrl: '',
      tags: [], 
    },
    mode: 'onChange', // 실시간 validation
  });
}
