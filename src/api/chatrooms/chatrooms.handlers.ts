import { NextFunction, Request, Response } from "express";
import { prisma } from "../../db";

export async function createChatRoom(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = res.locals.userId;

    const chatRoom = await prisma.chatRoom.create({
      data: {
        name: req.body.name,
        users: {
          connect: {
            id: userId,
          },
        },
        authorId: userId,
      },
    });

    res.json({
      chatRoom,
    });
  } catch (error) {
    next(error);
  }
}
