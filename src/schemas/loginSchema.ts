import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "이메일은 필수 입력입니다." })
    .email({ message: "이메일 형식으로 작성해 주세요." }),
  password: z
    .string()
    .min(8, { message: "비밀번호는 최소 8자 이상이어야 합니다." }),
});

export type LoginSchema = z.infer<typeof loginSchema>;
