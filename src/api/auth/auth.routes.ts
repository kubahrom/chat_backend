import { Router } from "express";

import * as AuthHandlers from "./auth.handlers";
import { validateRequest } from "../../middlewares";
import { Register } from "./auth.model";

const router = Router();

router.post(
  "/register",
  validateRequest({
    body: Register,
  }),
  AuthHandlers.register
);

export default router;
