import { NextFunction, Request, Response } from "express";
import { prisma } from "../../db";
import { AddMessageBody, GetMessagesQuery } from "./messages.model";
import { connections } from "../../websockets";

export async function getMessages(
  req: Request<{}, {}, {}, GetMessagesQuery>,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = res.locals.userId;
    const { take, skip, id } = req.query;

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
        createdAt: "asc",
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      take: take ? Number(take) : undefined,
      skip: skip ? Number(skip) : undefined,
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
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    sendMessageToChatRoom(id, message);

    res.json({
      data: message,
    });
  } catch (error) {
    next(error);
  }
}

async function sendMessageToChatRoom(
  chatRoomId: string,
  message: {
    id: string;
    author: {
      id: string;
      name: string;
    };
    createdAt: Date;
    content: string;
  }
) {
  for (const connection of connections[chatRoomId]) {
    if (connection.userId !== message.author.id) {
      connection.ws.send(
        JSON.stringify({
          type: "new-message",
          payload: message,
        })
      );
    }
  }
}
