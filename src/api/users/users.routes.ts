import { Router } from "express";

import { checkAuth } from "../../middlewares";
import * as UsersHandlers from "./users.handlers";

const router = Router();

router.get("/", checkAuth, UsersHandlers.getUsers);

export default router;
