import { AnyZodObject, ZodEffects } from "zod";

export default interface RequestValidators {
  params?: AnyZodObject;
  body?: AnyZodObject | ZodEffects<AnyZodObject>;
  query?: AnyZodObject;
}
