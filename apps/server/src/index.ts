import "dotenv/config";
import { createServer } from "node:http";
import { connectDB } from "@chat/db";

import app from "./app";
import { initSocketServer } from "./socket";

const port = Number(process.env.PORT ?? 5001);

async function start() {
  await connectDB();

  const httpServer = createServer(app);
  initSocketServer(httpServer);

  httpServer.listen(port, () => {
    console.log(`Socket server listening on ${port}`);
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
