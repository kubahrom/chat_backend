import express from "express";

import auth from "./auth/auth.routes";
import chatrooms from "./chatrooms/chatrooms.routes";

const router = express.Router();

router.use("/auth", auth);
router.use("/chatrooms", chatrooms);

export default router;
