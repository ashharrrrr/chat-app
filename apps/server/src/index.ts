import { connectDB } from "@chat/db";

async function main() {
  await connectDB();
  console.log("Connected!");
}

main();
