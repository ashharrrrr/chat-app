import { NextResponse } from "next/server";
import { connectDB, User, Conversation } from "@chat/db";
import { createGroupSchema } from "@chat/shared-types";
import { Types } from "mongoose";
import { getSessionUser } from "@/lib/api/auth";
import { notFound, unauthorized, badRequest, internalServerError } from "@/lib/api/responses"

export async function POST(req: Request) {
  try {

    const currentUser = await getSessionUser();

    if (!currentUser) {
      return unauthorized();
    }

    const body = await req.json();

    const result = createGroupSchema.safeParse(body);

    if (!result.success) {
      const error = result.error.issues[0]?.message ?? "Invalid Input"
      return badRequest(error)
    }

    const { title, usernames } = result.data;

    await connectDB();

    const invitedUsers = await User.find({
      username: {
        $in: usernames
      }
    })

    if (invitedUsers.length !== usernames.length) {
      return notFound("One or more users not found")
    }

    if (invitedUsers.some(user => user._id.toString() === currentUser.id)) {
      return badRequest("You cannot invite yourself you schizo bitch")
    }

    const participants = [
      {
        user: new Types.ObjectId(currentUser.id),
        role: "admin" as const,
        joinedAt: new Date(),
      },

      ...invitedUsers.map((user) => ({
        user: user._id,
        role: "member" as const,
        joinedAt: new Date(),
      })),
    ];

    const conversation = await Conversation.create({
      title,
      isGroup: true,
      participants,
    });

    await conversation.populate({
      path: "participants.user",
      select: "username image about",
    })

    return NextResponse.json(conversation, {
      status: 201,
    });

  } catch (error) {
    console.error("GET GROUP CREATION ERROR:", error);
    return internalServerError
  }
}
