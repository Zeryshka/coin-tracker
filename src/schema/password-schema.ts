import z from "zod";
import { PASSWORD_REGEX } from "@/lib/constants";

export const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Пароль должен содержать минимум 8 символов")
      .regex(PASSWORD_REGEX, "Пароль должен содержать заглавные и строчные буквы, цифры и специальные символы"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export type PasswordValues = z.infer<typeof passwordSchema>;
