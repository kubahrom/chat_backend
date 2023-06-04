import { Response, Request, NextFunction } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";

import { LoginBody, RegisterBody } from "./auth.model";
import { prisma } from "../../db";

export async function register(
  { body }: Request<{}, {}, RegisterBody>,
  res: Response,
  next: NextFunction
) {
  try {
    const userExists = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (userExists) {
      res.status(409);
      throw new Error("user_already_exists");
    }

    const password = await bcrypt.hash(body.password, 10);
    const token = crypto.randomBytes(16).toString("hex");

    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        password,
        token,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });

    res.json({
      user,
    });

    res.status(201);
  } catch (error) {
    next(error);
  }
}

export async function login(
  { body }: Request<{}, {}, LoginBody>,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user) {
      res.status(401);
      throw new Error("user_not_found");
    }

    const passwordMatch = await bcrypt.compare(body.password, user.password);

    if (!passwordMatch) {
      res.status(401);
      throw new Error("wrong_credentials");
    }

    const token = crypto.randomBytes(16).toString("hex");

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        token,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });

    res.json({
      updatedUser,
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    res.cookie("token", "");
    res.status(204);
    res.end();
  } catch (error) {
    next(error);
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = res.locals.userId;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      res.status(401);
      throw new Error("user_not_found");
    }

    res.json({
      user: user,
    });
  } catch (error) {
    next(error);
  }
}
