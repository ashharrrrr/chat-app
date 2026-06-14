import { NextResponse } from "next/server";
import { sign } from "jsonwebtoken";

import { auth } from "@/auth";

export const runtime = "nodejs";

export async function GET(){
  const session = await auth();

  if(!session?.user?.id) {
    return NextResponse.json(
      {
        messsage: "Unauthorized",
      },
      {
        status: 401
      }
    );
  }

  const secret = process.env.SOCKET_SECRET;

  if(!secret) {
    return NextResponse.json(
      { message: "SOCKET_SECRET is no defined" },
      { status: 500 }
    )
  }

  const token = sign(
    {
      userId: session.user.id,
      username: session.user.username,
    },
    secret,
    { expiresIn: "1h" }
  );

  return NextResponse.json({ token });
}
