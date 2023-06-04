import { NextFunction, Request, Response } from "express";

import { prisma } from "../../db";
import { CreateChatRoomBody } from "./chatrooms.model";
import { ParamsWithId } from "../../types/ParamsWithId";

export async function getChatRooms(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = res.locals.userId;
    const chatRooms = await prisma.chatRoom.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        users: {
          select: {
            name: true,
          },
        },
      },
    });
    res.json({
      data: chatRooms,
    });
  } catch (error) {
    next(error);
  }
}

export async function getChatRoom(
  req: Request<ParamsWithId>,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = res.locals.userId;
    const chatRoomId = req.params.id;

    const chatRoom = await prisma.chatRoom.findFirst({
      where: {
        id: chatRoomId,
        users: {
          some: {
            id: userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        users: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!chatRoom) {
      res.status(404);
      throw new Error("not-found");
    }

    res.json({
      data: chatRoom,
    });
  } catch (error) {
    next(error);
  }
}

export async function createChatRoom(
  { body }: Request<{}, {}, CreateChatRoomBody>,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = res.locals.userId;

    const chatRoom = await prisma.chatRoom.create({
      data: {
        name: body.name,
        users: {
          connect: {
            id: userId,
          },
        },
        authorId: userId,
      },
    });

    res.json({
      data: chatRoom,
    });
  } catch (error) {
    next(error);
  }
}
