import { z } from "zod";
import { schemaBuilder } from "../../utils/schemaBuilder";

export const CreateChatRoomValidator = z.object({
  name: schemaBuilder.name,
});

export type CreateChatRoomBody = z.infer<typeof CreateChatRoomValidator>;
