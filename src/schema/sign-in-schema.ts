import z from "zod";

export const signInSchema = z.object({
  login: z.string().min(1, "Login or email is required"),
  password: z.string().min(1, "Password is required"),
});

export type SignInValues = z.infer<typeof signInSchema>;
