import { z } from "zod";
import { schemaBuilder } from "../utils/schemaBuilder";

export const ParamsWithIdValidator = z.object({
  id: schemaBuilder.id,
});

export type ParamsWithId = z.infer<typeof ParamsWithIdValidator>;
