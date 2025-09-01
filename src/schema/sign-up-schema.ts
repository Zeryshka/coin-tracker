import z from "zod";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const signUpSchema = z
  .object({
    login: z
      .string()
      .min(2, "Логин должен содержать минимум 2 символа")
      .max(20, "Логин не должен превышать 20 символов")
      .regex(/^[a-zA-Z0-9_]+$/, "Логин может содержать только буквы, цифры и нижнее подчёркивание"),

    email: z.string().email("Введите корректный email"),

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
