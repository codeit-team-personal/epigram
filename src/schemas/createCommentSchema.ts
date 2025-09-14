import { z } from 'zod';

export const createCommentSchema = z.object({
  content: z
    .string()
    .trim() // 앞뒤 공백 제거
    .min(1, '댓글을 입력해주세요.') // 공백만 있으면 길이가 0이 돼서 막힘
    .max(100, '댓글은 100자 이내로 입력해주세요.'),
  isPrivate: z.boolean().default(false),
});

export type CreateCommentSchema = z.infer<typeof createCommentSchema>;
