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
      passwordConfirmation: "",
      nickname: "",
    },
    mode: "onChange", // 실시간 validation
  });

  const password = form.watch("password");
  const confirmTouched = form.formState.touchedFields.passwordConfirmation;

  useEffect(() => {
    if (confirmTouched) {
      // password가 바뀔 때 passwordConfirmation 같이 재검증
      form.trigger("passwordConfirmation");
    }
  }, [password, confirmTouched, form]);

  return form;
}
