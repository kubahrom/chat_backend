import { NextFunction, Request, Response } from "express";
import { prisma } from "../../db";
import { GetMessagesBody, GetMessagesQuery } from "./messages.model";

export async function getMessages(
  req: Request<{}, {}, GetMessagesBody, GetMessagesQuery>,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = res.locals.userId;
    const { id } = req.body;
    const { take, skip } = req.query;

    const messages = await prisma.message.findMany({
      where: {
        chatRoomId: id,
        AND: {
          ChatRoom: {
            users: {
              some: {
                id: userId,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        authorId: true,
      },
      take,
      skip,
    });

    res.json({
      data: messages,
    });
  } catch (error) {
    next(error);
  }
}
