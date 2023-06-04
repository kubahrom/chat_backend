import { z } from "zod";
import { schemaBuilder } from "../../utils/schemaBuilder";

export const Register = z
  .object({
    email: schemaBuilder.email,
    name: schemaBuilder.name,
    password: schemaBuilder.password,
    confirmPassword: schemaBuilder.password,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "passwords_do_not_match",
  });

export type RegisterBody = z.infer<typeof Register>;

export const Login = z.object({
  email: schemaBuilder.email,
  password: schemaBuilder.password,
});

export type LoginBody = z.infer<typeof Login>;
