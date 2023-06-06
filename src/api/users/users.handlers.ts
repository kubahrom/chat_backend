import { NextFunction, Request, Response } from "express";
import { prisma } from "../../db";

export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = res.locals.userId;

    const users = await prisma.user.findMany({
      where: {
        id: {
          not: userId,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    res.json({
      data: users,
    });
  } catch (error) {
    next(error);
  }
}
