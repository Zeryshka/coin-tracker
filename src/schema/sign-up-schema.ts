import z from "zod";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const signUpSchema = z
  .object({
    login: z
      .string()
      .min(2, "Login must contain at least 2 characters")
      .max(20, "Login must not exceed 20 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Login can only contain letters, numbers, and underscores"),

    email: z.string().email("Please enter a valid email"),

    password: z
      .string()
      .min(8, "Password must contain at least 8 characters")
      .regex(PASSWORD_REGEX, "Password must contain uppercase and lowercase letters, numbers, and special characters"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
