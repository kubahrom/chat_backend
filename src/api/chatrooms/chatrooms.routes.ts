import { Router } from "express";

import * as ChatRoomHandlers from "./chatrooms.handlers";
import { checkAuth, validateRequest } from "../../middlewares";
import { CreateChatRoomValidator } from "./chatrooms.model";

const router = Router();

router.post(
  "/",
  checkAuth,
  validateRequest({
    body: CreateChatRoomValidator,
  }),
  ChatRoomHandlers.createChatRoom
);

export default router;
