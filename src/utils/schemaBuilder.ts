import { z } from "zod";

const required = { required_error: "required" };
const invalidType = { invalid_type_error: "invalid_type" };

export const schemaBuilder = {
  id: z.string(required),
  email: z.string(required).email("invalid_email").max(255, "too_long"),
  name: z.string(required).min(2, "too_short").max(255, "too_long"),
  password: z.string(required).min(8, "too_short").max(255, "too_long"),
  users: z.array(z.string(required)).optional(),
  numberQuery: z
    .preprocess(
      (val) => parseFloat(z.string().parse(val)),
      z
        .number(invalidType)
        .int("not_int")
        .positive("not_positive")
        .max(9999, "too_big")
    )
    .optional(),
};
