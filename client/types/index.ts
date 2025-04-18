import * as z from "zod";

export const RegisterTypes = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email(),
  password: z.string().min(10, {
    message: "Password must be at least 10 characters.",
  }),
});

export const LoginTypes = z.object({
  email: z.string().email(),
  password: z.string().min(10, {
    message: "Password must be at least 10 characters.",
  }),
});