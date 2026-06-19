import { verify } from "jsonwebtoken";
import { Server, type Socket } from "socket.io";
import type { Server as HttpServer } from  "node:http";

import type {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData,
  MessagePayload,
} from "@chat/shared-types";

type SocketTokenPayload = {
  userId: string;
  username: string;
}

let io: Server<ClientToServerEvents, ServerToClientEvents, {}, SocketData> | null = null;

export function initSocketServer( httpServer: HttpServer ) {
  if (io) return io;

  const socketSecret = process.env.SOCKET_SECRET;

  if (!socketSecret) {
    throw new Error("SOCKET_SECRET is not defined");
  }

  const webOrigin = process.env.WEB_ORIGIN;

  if (!webOrigin) {
    throw new Error(
      "WEB_ORIGIN is not defined"
    );
  }

  io = new Server(httpServer, {
    cors: {
      origin: webOrigin,
      credentials: true,
    },
  })

  io.use((socket, next) =>{
    const token = socket.handshake.auth?.token;

    if (typeof token !== "string") {
      return next(
        new Error("Unauthorized")
      );
    }

    try  {
      const payload = verify(token, socketSecret) as SocketTokenPayload;

      socket.data.user = {
        id: payload.userId,
        username: payload.username,
      };

      next();

    } catch (error) {
      console.error(error);
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("conversation:join", ({ conversationId }) => {
      socket.join(conversationId);
    });

    socket.on("message:send", (payload: MessagePayload) => {
      socket.to(payload.conversationId).emit("message:new", payload);
    });
  });

  return io;
}

export  function getIO() {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }

  return io;
}


