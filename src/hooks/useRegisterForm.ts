import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterSchema } from "@/schemas/signupSchema";
import { useEffect } from "react";

export function useRegisterForm() {
  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      nickname: "",
    },
    mode: "onChange", // 실시간 validation
  });

  const password = form.watch("password");
  const confirmTouched = form.formState.touchedFields.confirmPassword;

  useEffect(() => {
    if (confirmTouched) {
      // password가 바뀔 때 confirmPassword도 같이 재검증
      form.trigger("confirmPassword");
    }
  }, [password, confirmTouched, form]);

  return form;
}
