import { Router } from "express";

import * as AuthHandlers from "./auth.handlers";
import { validateRequest } from "../../middlewares";
import { Login, Register } from "./auth.model";

const router = Router();

router.post(
  "/register",
  validateRequest({
    body: Register,
  }),
  AuthHandlers.register
);

router.post(
  "/login",
  validateRequest({
    body: Login,
  }),
  AuthHandlers.login
);

router.post("/logout", AuthHandlers.logout);

router.get("/me", AuthHandlers.me);

export default router;
