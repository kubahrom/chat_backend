import { Router } from "express";

import { checkAuth, validateRequest } from "../../middlewares";
import * as MessagesHandlers from "./messages.handlers";
import { GetMessagesValidator } from "./messages.model";

const router = Router();

router.get(
  "/",
  checkAuth,
  validateRequest({
    body: GetMessagesValidator.body,
    query: GetMessagesValidator.query,
  }),
  MessagesHandlers.getMessages
);

export default router;
