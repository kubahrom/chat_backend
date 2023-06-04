import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  throw new Error("Error thrown from /api/auth");
  res.json({
    message: "auth",
  });
});

export default router;
