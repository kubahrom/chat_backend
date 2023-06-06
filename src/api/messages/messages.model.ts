import { z } from "zod";
import { schemaBuilder } from "../../utils/schemaBuilder";

export const GetMessagesValidator = {
  body: z.object({
    id: schemaBuilder.id,
  }),
  query: z.object({
    take: schemaBuilder.numberQuery,
    skip: schemaBuilder.numberQuery,
  }),
};

export type GetMessagesBody = z.infer<(typeof GetMessagesValidator)["body"]>;
export type GetMessagesQuery = z.infer<(typeof GetMessagesValidator)["query"]>;

export const AddMessageValidator = z.object({
  id: schemaBuilder.id,
  content: schemaBuilder.content,
});

export type AddMessageBody = z.infer<typeof AddMessageValidator>;
