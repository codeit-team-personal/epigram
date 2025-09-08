import { z } from 'zod';

/**
 * 단일 태그 스키마
 */
export const singleTagSchema = z
  .string()
  .min(1, '빈 태그는 추가할 수 없어요.')
  .max(10, '태그는 10자 이하로 입력해주세요.')
  .regex(/^[^\s]+$/, '공백은 허용되지 않아요.')
  .transform((s) => s.trim());

/**
 * 전체 태그 배열 스키마
 */
export const fullTagsSchema = z
  .array(singleTagSchema)
  .max(3, '태그는 최대 3개까지예요.')

  //superRefine는 여러 개의 addIssue를 찍을 수 있고, **문제의 위치(path)**를 세밀하게 지정할 수 있음
  .superRefine((arr, ctx) => {
    const lower = arr.map((s) => s.toLowerCase());

    //1. lower: 배열 (예: ['js', 'ts', 'js'])
    //2. new Set(lower): 배열을 Set 자료구조로 변환, Set은 중복을 허용하지 않는 컬렉션
    //    - 따라서 [ 'js', 'ts', 'js' ] → Set { 'js', 'ts' }
    //3. .size: Set의 원소 개수(중복 제거된 후 길이)
    //4. 중복이 있으면: Set 크기 < 배열 길이
    //“배열에 중복된 값이 있으면 true”라는 뜻
    if (new Set(lower).size !== lower.length) {
      ctx.addIssue({
        code: 'custom',
        message: '같은 태그를 중복해서 추가할 수 없어요.',
      });
    }
  });

/**
 * Epigram 작성 스키마
 */
export const createSchema = z
  .object({
    content: z
      .string()
      .min(1, '내용을 입력해주세요.')
      .max(500, '500자 이내로 입력해주세요.'),
    authorType: z.enum(['직접 입력', '알 수 없음', '본인']),
    authorName: z.string().optional(),
    referenceTitle: z.string().optional(),
    referenceUrl: z.string().optional(), // 빈 값은 허용
    tags: fullTagsSchema.optional(),
  })
  // 조건부 검증: authorType === '직접 입력'일 때만 authorName 필수
  .refine(
    (data) => {
      if (data.authorType === '직접 입력') {
        return !!data.authorName && data.authorName.trim().length > 0;
      }
      return true;
    },
    {
      path: ['authorName'],
      message: '저자를 입력해주세요.',
    }
  );

export type CreateSchema = z.infer<typeof createSchema>;
