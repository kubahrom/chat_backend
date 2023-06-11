import cookieParser from "cookie-parser";
import { Request, Response } from "express";
import { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";

type Connection = {
  ws: WebSocket;
  userId: string;
};

type Connections = {
  [chatroomId: string]: Set<Connection>;
};

export const connections: Connections = {};

export function createWebSocketServer(server: Server) {
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (req, socket, head) => {
    socket.on("error", (error) => {
      console.log(error);
    });

    cookieParser()(req as Request, {} as Response, () => {
      const token: string = (req as Request).cookies.token;

      jwt.verify(
        token || "",
        process.env.TOKEN_SECRET as string,
        (err, data) => {
          if (err) {
            socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
            socket.destroy();
            return;
          }
          const url = new URL(req.url!, `http://${req.headers.host}`);
          const chatroomId = url.searchParams.get("id");

          if (!chatroomId) {
            socket.write("HTTP/1.1 400 Bad Request\r\n\r\n");
            socket.destroy();
            return;
          }

          (req as Request).cookies.chatroomId = chatroomId;
          (req as Request).cookies.userId = (data as { userId: string }).userId;

          wss.handleUpgrade(req, socket, head, (ws) => {
            wss.emit("connection", ws, req);
          });
        }
      );
    });
  });

  wss.on("connection", (ws, req) => {
    const { chatroomId, userId } = (req as Request).cookies;

    if (!connections[chatroomId]) {
      connections[chatroomId] = new Set();
    }
    connections[chatroomId].add({ ws, userId });

    ws.on("close", () => {
      for (const connection of connections[chatroomId]) {
        if (connection.ws === ws) {
          connections[chatroomId].delete(connection);
        }
      }

      if (connections[chatroomId].size === 0) {
        delete connections[chatroomId];
      }
    });
  });
}
