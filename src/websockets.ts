import cookieParser from "cookie-parser";
import { Request, Response } from "express";
import { Server } from "http";
import { WebSocketServer } from "ws";

export function createWebSocketServer(server: Server) {
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (req, socket, head) => {
    socket.on("error", (error) => {
      console.log(error);
    });

    cookieParser()(req as Request, {} as Response, () => {
      console.log(req);

      const url = new URL(req.url!, `http://${req.headers.host}`);
      const a = url.searchParams.get("a");
      console.log(a);
    });

    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req);
    });
  });

  wss.on("connection", (ws, req) => {
    console.log("WebSocket connected");

    ws.on("close", () => {
      console.log("WebSocket closed");
    });
  });
}
