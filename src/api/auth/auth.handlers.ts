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

    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        password,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    const token = jwt.sign(
      { userId: user.id },
      process.env.TOKEN_SECRET as string,
      {
        expiresIn: "30d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    });

    res.json({
      data: user,
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
        name: true,
        email: true,
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

    const token = jwt.sign(
      { userId: user.id },
      process.env.TOKEN_SECRET as string,
      {
        expiresIn: "30d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    });

    res.json({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
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
    console.log(userId);

    const user = await prisma.user.findFirst({
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
      res.status(404);
      throw new Error("not-found");
    }

    res.json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

// export async function refresh(req: Request, res: Response, next: NextFunction) {
//   try {
//     const token: string | undefined = req.cookies.token;
//     if (!token) {
//       res.status(401);
//       throw new Error("unauthorized");
//     }

//     const user = await prisma.user.findFirst({
//       where: {
//         token,
//       },
//       select: {
//         id: true,
//       },
//     });

//     const at = jwt.sign(
//       { userId: user?.id },
//       process.env.ACCESS_TOKEN_SECRET as string,
//       { expiresIn: 60 * 10 }
//     );

//     res.json({
//       data: at,
//     });
//   } catch (error) {
//     next(error);
//   }
// }
