import { z } from "zod";
import { schemaBuilder } from "../../utils/schemaBuilder";

export const CreateChatRoomValidator = z.object({
  name: schemaBuilder.name,
  users: schemaBuilder.users,
});

export type CreateChatRoomBody = z.infer<typeof CreateChatRoomValidator>;

export const UpdateChatRoomValidator = z
  .object({
    name: schemaBuilder.name.optional(),
    users: schemaBuilder.users,
  })
  .superRefine((data, ctx) => {
    if (!data.name && !data.users) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "name or users is required",
        path: ["name"],
      });
    }
  });

export type UpdateChatRoomBody = z.infer<typeof UpdateChatRoomValidator>;
