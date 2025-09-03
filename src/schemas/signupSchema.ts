import { z } from "zod";

export const registerSchema = z
  .object({
    email: z
      .string()
      .nonempty("이메일은 필수 입력입니다.")
      .email("이메일 형식으로 작성해 주세요."),
    password: z
      .string()
      .nonempty("비밀번호는 필수 입력입니다.")
      .min(8, "비밀번호는 최소 8자 이상입니다.")
      .regex(
        /^[A-Za-z0-9!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?`~]+$/,
        "비밀번호는 숫자, 영문, 특수문자로만 가능합니다."
      ),
    confirmPassword: z.string().nonempty("비밀번호 확인을 입력해주세요."),
    nickname: z
      .string()
      .nonempty("닉네임은 필수 입력입니다.")
      .max(20, "닉네임은 최대 20자까지 가능합니다."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
