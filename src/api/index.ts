import express from "express";

import auth from "./auth/auth.routes";
import chatrooms from "./chatrooms/chatrooms.routes";
import users from "./users/users.routes";

const router = express.Router();

router.use("/auth", auth);
router.use("/chatrooms", chatrooms);
router.use("/users", users);

export default router;
