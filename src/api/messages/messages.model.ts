import { z } from "zod";
import { schemaBuilder } from "../../utils/schemaBuilder";

export const GetMessagesValidator = z.object({
  id: schemaBuilder.id,
  take: schemaBuilder.numberQuery,
  skip: schemaBuilder.numberQuery,
});

export type GetMessagesQuery = {
  id: string;
  take?: string;
  skip?: string;
};

export const AddMessageValidator = z.object({
  id: schemaBuilder.id,
  content: schemaBuilder.content,
});

export type AddMessageBody = z.infer<typeof AddMessageValidator>;
