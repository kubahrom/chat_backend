import { z } from "zod";

const required = { required_error: "required" };

export const schemaBuilder = {
  id: z.string(required),
  email: z.string(required).email("invalid_email").max(255, "too_long"),
  name: z.string(required).min(2, "too_short").max(255, "too_long"),
  password: z.string(required).min(8, "too_short").max(255, "too_long"),
  users: z.array(z.string(required)).optional(),
};
