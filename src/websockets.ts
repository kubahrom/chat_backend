import cookieParser from "cookie-parser";
import { Request, Response } from "express";
import { Server } from "http";
import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";

export function createWebSocketServer(server: Server) {
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (req, socket, head) => {
    socket.on("error", (error) => {
      console.log(error);
    });

    cookieParser()(req as Request, {} as Response, () => {
      // console.log((req as Request).cookies.token);
      // wss.handleUpgrade(req, socket, head, (ws) => {
      //   wss.emit("connection", ws, req);
      // });

      const url = new URL(req.url!, `http://${req.headers.host}`);
      const at = url.searchParams.get("at");
      const id = url.searchParams.get("id");
      console.log(id, (req as Request).cookies.token);

      jwt.verify(
        at || "",
        process.env.ACCESS_TOKEN_SECRET as string,
        (err, data) => {
          if (err) {
            socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
            socket.destroy();
            return;
          }
          wss.handleUpgrade(req, socket, head, (ws) => {
            wss.emit("connection", ws, req);
          });
        }
      );
    });
  });

  wss.on("connection", (ws, req) => {
    console.log("WebSocket connected");
    // console.log(req);

    ws.send("Hello from WebSocket server");

    ws.on("close", () => {
      console.log("WebSocket closed");
    });
  });
}
