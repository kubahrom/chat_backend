import { NextFunction, Request, Response } from "express";
import { prisma } from "../../db";
import {
  AddMessageBody,
  GetMessagesBody,
  GetMessagesQuery,
} from "./messages.model";

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

export async function addMessage(
  req: Request<{}, {}, AddMessageBody>,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = res.locals.userId;
    const { id, content } = req.body;

    const chatRoom = await prisma.chatRoom.findFirst({
      where: {
        id,
        users: {
          some: {
            id: userId,
          },
        },
      },
    });

    if (!chatRoom) {
      res.status(404);
      throw new Error("not-found");
    }

    const message = await prisma.message.create({
      data: {
        content,
        authorId: userId,
        chatRoomId: id,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        authorId: true,
      },
    });

    res.json({
      data: message,
    });
  } catch (error) {
    next(error);
  }
}
