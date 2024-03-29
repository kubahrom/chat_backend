import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";
import RequestValidators from "./types/RequestValidators";

export function validateRequest(validators: RequestValidators) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (validators.params) {
        req.params = await validators.params.parseAsync(req.params);
      }
      if (validators.body) {
        req.body = await validators.body.parseAsync(req.body);
      }
      if (validators.query) {
        req.query = await validators.query.parseAsync(req.query);
      }
      next();
    } catch (error) {
      let err = error;
      if (err instanceof ZodError) {
        err = err.issues.map((e) => ({ path: e.path[0], message: e.message }));
      }
      return res.status(422).json({
        status: "failed",
        error: err,
      });
    }
  };
}

export async function checkAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token: string | undefined = req.cookies.token;

    if (!token) {
      res.status(401);
      throw new Error("unauthorized");
    }

    jwt.verify(token, process.env.TOKEN_SECRET as string, (err, data) => {
      if (err) {
        res.status(403);
        throw new Error("forbidden");
      }

      res.locals.userId = (data as { userId: string }).userId;
    });
    next();
  } catch (error) {
    next(error);
  }
}

export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error("not-found");
  next(error);
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
}
