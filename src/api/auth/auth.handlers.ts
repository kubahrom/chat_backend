import { Response, Request, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
    const token = jwt.sign({}, process.env.REFRESH_TOKEN_SECRET as string);

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

    const at = jwt.sign(
      { userId: user.id },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: 60 * 10,
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    });

    res.json({
      data: user,
      at,
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

    const token = jwt.sign({}, process.env.REFRESH_TOKEN_SECRET as string, {
      expiresIn: "30d",
    });

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

    const at = jwt.sign(
      { userId: updatedUser.id },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: 60 * 10,
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });

    res.json({
      data: updatedUser,
      at,
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = res.locals.userId;

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        token: "",
      },
    });

    res.cookie("token", "");
    res.status(204);
    res.end();
  } catch (error) {
    next(error);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const token: string | undefined = req.cookies.token;
    if (!token) {
      res.status(401);
      throw new Error("unauthorized");
    }

    const user = await prisma.user.findFirst({
      where: {
        token,
      },
      select: {
        id: true,
      },
    });

    const at = jwt.sign(
      { userId: user?.id },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: 1000 * 60 * 10 }
    );

    res.json({
      at,
    });
  } catch (error) {
    next(error);
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    const token: string | undefined = await req.cookies.token;
    if (!token) {
      res.status(401);
      throw new Error("unauthorized");
    }

    const user = await prisma.user.findFirst({
      where: {
        token,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      res.status(401);
      throw new Error("unauthorized");
    }

    const at = jwt.sign(
      { userId: user.id },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: 60 * 10 }
    );

    res.json({
      data: user,
      at,
    });
  } catch (error) {
    next(error);
  }
}
