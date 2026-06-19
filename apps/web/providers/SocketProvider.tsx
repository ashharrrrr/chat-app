"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { io, type Socket } from "socket.io-client";

import type { ClientToServerEvents, ServerToClientEvents } from "@chat/shared-types";

type ChatSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

const SocketContext = createContext<ChatSocket | null>(null);

export function SocketProvider({
  children,
}: { children: ReactNode }) {
  const [socket, setSocket] = useState<ChatSocket | null>(null);

  useEffect(() => {
    let activeSocket: ChatSocket | null = null;

    async function connect() {
      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;

      if(!socketUrl) {
        throw new Error(
          "NEXT_PUBLIC_SOCKET_URL is no defined"
        );
      }

      const tokenResponse = await fetch("/api/socket-token");

      if (!tokenResponse.ok) {
        throw new Error(
          "Failed to create socket  token"
        );
      }

      const { token } = (await tokenResponse.json()) as { token: string };

      activeSocket = io(socketUrl, {
        auth: { token },
      });

      setSocket(activeSocket);
    }

    connect().catch((error)=> {
      console.error(
        "Socket connection error:",
        error
      );
    });


    return () =>{
      activeSocket?.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

export function useChatSocket(){
  return useContext(SocketContext);
}
