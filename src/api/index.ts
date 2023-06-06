import express from "express";

import auth from "./auth/auth.routes";
import chatrooms from "./chatrooms/chatrooms.routes";
import users from "./users/users.routes";
import messages from "./messages/messages.routes";

const router = express.Router();

router.use("/auth", auth);
router.use("/chatrooms", chatrooms);
router.use("/users", users);
router.use("/messages", messages);

export default router;
