import { NextResponse } from "next/server";

import { auth } from "@/auth";

import { connectDB, Conversation, Message } from "@chat/db";

import { sendMessageSchema } from "@chat/shared-types";
import { Types } from "mongoose";

export async function POST(req: Request) {
  try {

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const body = await req.json();

    const result = sendMessageSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          message: result.error.issues[0]?.message ?? "Invalid input",
        },
        {
          status: 400,
        }
      );
    }

    const { conversationId, content } = result.data;

    await connectDB();

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return NextResponse.json(
        {

          message: "Conversation not found!",
        },
        {
          status: 404,
        }
      );
    }

    const isParticipant = conversation.participants.some((participant: Types.ObjectId) => participant.toString() === session.user.id);

    if (!isParticipant) {
      return NextResponse.json(
        {
          message: "Forbidden",
        },
        {
          status: 403,
        }
      );
    }

    const message = await Message.create({
      conversationId,
      senderId: session.user.id,
      content,
    });

    conversation.lastMessage = message._id;

    await conversation.save();

    return NextResponse.json(
      message,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST MESSAGE ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}


export async function GET(req: Request) {
  try{

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const { searchParams }= new URL(req.url);

    const conversationId = searchParams.get("conversationId");

    if(!conversationId) {
      return NextResponse.json(
        {
          message: "Conversation ID is required!!!"
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return NextResponse.json(
        {
          message: "Conversation not found",
        },
        {
          status: 404,
        }
      );
    }

    const isParticipant = conversation.participants.some((participant: Types.ObjectId) => participant.toString() === session.user.id);

    if (!isParticipant) {
      return NextResponse.json(
        {
          message: "Forbidden"
        },
        {
          status: 403,
        }
      );
    }

    const messages = await Message.find({
      conversationId,
    }).populate("senderId", "username image").sort({ createdAt: 1 });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("GET MESSAGES ERROR:", error);

    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}
