import { NextResponse } from "next/server";

import { auth } from "@/auth";

import { connectDB, User, Conversation } from "@chat/db";

import { createConversationSchema } from "@chat/shared-types";

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
        },
      );
    }

    const body = await req.json();

    const result = createConversationSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          message: result.error.issues[0]?.message ?? "Invalid input",
        },
        {
          status: 400,
        },
      );
    }

    const { username } = result.data;

    await connectDB();

    const targetUser = await User.findOne({
      username,
    });

    if (!targetUser) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        {
          status: 404,
        },
      );
    }

    if (targetUser._id.toString() === session.user.id) {
      return NextResponse.json(
        {
          message: "Cannot create conversion with yourself you schizo bitch",
        },
        {
          status: 400,
        },
      );
    }

    const existingConversation = await Conversation.findOne({
      isGroup: false,
      participants: {
        $all: [session.user.id, targetUser._id],
      },
    });

    if (existingConversation) {
      return NextResponse.json(existingConversation);
    }

    const conversation = await Conversation.create({
      participants: [session.user.id, targetUser._id],
      isGroup: false,
    });

    return NextResponse.json(conversation, {
      status: 201,
    });
  } catch (error) {
    console.error("CREATE CONVERSATION ERROR:", error);

    return NextResponse.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    await connectDB();


    const conversations = await Conversation.find({
      participants: session.user.id,
    })
      .populate("participants", "username image")
      .sort({ updatedAt: -1 })
      .populate({
        path: "lastMessage",
        select: "content  senderId createdAt",
        populate: {
          path: "senderId",
          select: "username",
        },
      });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error("GET CONVERSATIONS ERROR:", error);

    return NextResponse.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}
