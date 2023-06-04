import { Router } from "express";

import * as ChatRoomHandlers from "./chatrooms.handlers";
import { checkAuth, validateRequest } from "../../middlewares";
import { CreateChatRoomValidator } from "./chatrooms.model";
import { ParamsWithIdValidator } from "../../types/ParamsWithId";

const router = Router();

router.get("/", checkAuth, ChatRoomHandlers.getChatRooms);

router.get(
  "/:id",
  checkAuth,
  validateRequest({
    params: ParamsWithIdValidator,
  }),
  ChatRoomHandlers.getChatRoom
);

router.post(
  "/",
  checkAuth,
  validateRequest({
    body: CreateChatRoomValidator,
  }),
  ChatRoomHandlers.createChatRoom
);

export default router;
