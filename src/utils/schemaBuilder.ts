import { z } from "zod";

const required = { required_error: "required" };
const invalidType = { invalid_type_error: "invalid_type" };

export const schemaBuilder = {
  id: z.string(required),
  email: z.string(required).email("invalid-email").max(255, "too-long"),
  name: z.string(required).min(2, "too-short").max(255, "too-long"),
  password: z.string(required).min(8, "too-short").max(255, "too-long"),
  users: z.array(z.string(required)).optional(),
  content: z.string(required).max(1000, "too-long"),
  numberQuery: z
    .preprocess(
      (val) => parseFloat(z.string().parse(val)),
      z
        .number(invalidType)
        .int("not-int")
        .positive("not-positive")
        .max(9999, "too-big")
    )
    .optional(),
};
