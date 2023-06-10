import { NextFunction, Request, Response } from "express";

import { prisma } from "../../db";
import { CreateChatRoomBody, UpdateChatRoomBody } from "./chatrooms.model";
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
        _count: {
          select: {
            users: true,
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
            id: true,
          },
        },
        authorId: true,
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
    const users = body.users || [];
    users.push(userId);

    const chatRoom = await prisma.chatRoom.create({
      data: {
        name: body.name,
        users: {
          connect: users.map((id) => ({
            id,
          })),
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

export async function deleteChatRoom(
  req: Request<ParamsWithId>,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = res.locals.userId;
    const chatRoomId = req.params.id;

    console.log("deleting");

    const chatRoom = await prisma.chatRoom.findFirst({
      where: {
        id: chatRoomId,
        authorId: userId,
      },
    });

    if (!chatRoom) {
      res.status(404);
      throw new Error("not-found");
    }

    await prisma.chatRoom.delete({
      where: {
        id: chatRoomId,
      },
    });

    res.json({
      data: chatRoom,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateChatRoom(
  req: Request<ParamsWithId, {}, UpdateChatRoomBody>,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = res.locals.userId;
    const chatRoomId = req.params.id;

    const chatRoom = await prisma.chatRoom.findFirst({
      where: {
        id: chatRoomId,
        authorId: userId,
      },
      select: {
        users: {
          where: {
            NOT: {
              id: userId,
            },
          },
        },
      },
    });

    if (!chatRoom) {
      res.status(404);
      throw new Error("not-found");
    }

    const oldUsers = chatRoom.users.map((user) => ({
      id: user.id,
    }));

    const newUsers = req.body.users || [];

    const usersToDisconnect = oldUsers.filter((user) => {
      return !newUsers.some((id) => id === user.id);
    });

    const usersToConnect = newUsers
      .filter((id) => {
        return !oldUsers.some((user) => user.id === id);
      })
      .map((id) => ({
        id,
      }));

    const updatedChatRoom = await prisma.chatRoom.update({
      where: {
        id: chatRoomId,
      },
      data: {
        name: req.body.name,
        users: {
          disconnect: usersToDisconnect,
          connect: usersToConnect,
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

    // const updatedChatRoom = await prisma.chatRoom.update({
    //   where: {
    //     id: chatRoomId,
    //   },
    //   data: {
    //     name: req.body.name,
    //     users: {
    //       connect: req.body.users?.map((id) => ({
    //         id,
    //       })),
    //     },
    //   },
    //   select: {
    //     id: true,
    //     name: true,
    //     users: {
    //       select: {
    //         name: true,
    //       },
    //     },
    //   },
    // });

    res.json({
      data: updatedChatRoom,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function leaveChatRoom(
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
        NOT: {
          authorId: userId,
        },
      },
    });

    if (!chatRoom) {
      res.status(404);
      throw new Error("not-found");
    }

    await prisma.chatRoom.update({
      where: {
        id: chatRoomId,
      },
      data: {
        users: {
          disconnect: {
            id: userId,
          },
        },
      },
    });

    res.json({
      data: chatRoom,
    });
  } catch (error) {
    next(error);
  }
}
