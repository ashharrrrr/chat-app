import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";

import { connectDB, Conversation, Message } from "@chat/db";
import { uploadChatImages, createSignedChatImageUrl, createSignedChatImageUrls } from "../../../lib/supbase/chatImages"

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
    const formData = await req.formData();

    const image = formData.get("image");

    const result = sendMessageSchema.safeParse({
      conversationId: formData.get("conversationId"),
      content: formData.get("content"),
      hasImage: image instanceof File,
    });

    if (!result.success) {
      console.log("zod error", z.formatError(result.error));
      return NextResponse.json(
        {
          message: result.error.issues[0]?.message ?? "Invalid input",
        },
        {
          status: 400,
        }
      );
    }

    const { conversationId, content } = result.data

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

    let imagePath: string | undefined;

    if (image instanceof File) {
      imagePath = await uploadChatImages(
        image,
        conversationId,
      );
    }

    const message = await Message.create({
      conversationId,
      senderId: session.user.id,
      content,
      image: imagePath,
    });

    await message.populate("senderId", "username image");

    conversation.lastMessage = message._id;
    await conversation.save();

    const messageObject = message.toObject()

    let imageUrl = messageObject.image;

    if (imageUrl) {
      try {
        imageUrl = await createSignedChatImageUrl(imageUrl);
      } catch (error) {
        console.error("Failed to sign", messageObject.image, error);

        imageUrl = undefined;
      }
    }

    const response = {
      ...messageObject,
      imageUrl,
    };

    return NextResponse.json(
      response,
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

    const { searchParams } = new URL(req.url);

    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
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

    const imagePaths = messages.map((message) => message.image).filter((image): image is string => Boolean(image));

    const signedUrls = await createSignedChatImageUrls(imagePaths);

    const response = messages.map((message) => {
      const object = message.toObject();

      return {
        ...object,
        image: object.image
          ? signedUrls.get(object.image)
          : undefined,
      };
    });

    return NextResponse.json(response);
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
