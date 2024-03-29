import { Router } from "express";

import * as AuthHandlers from "./auth.handlers";
import { checkAuth, validateRequest } from "../../middlewares";
import { LoginValidator, RegisterValidator } from "./auth.model";

const router = Router();

router.post(
  "/register",
  validateRequest({
    body: RegisterValidator,
  }),
  AuthHandlers.register
);

router.post(
  "/login",
  validateRequest({
    body: LoginValidator,
  }),
  AuthHandlers.login
);

router.post("/logout", checkAuth, AuthHandlers.logout);

router.get("/me", checkAuth, AuthHandlers.me);

// router.post("/refresh", AuthHandlers.refresh);

export default router;
