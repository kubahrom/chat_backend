import { Response, Request, NextFunction } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";

import { RegisterBody } from "./auth.model";
import { prisma } from "../../db";

export async function register(
  req: Request<{}, {}, RegisterBody, { test: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const { body } = req;

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
