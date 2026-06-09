import { NextResponse } from "next/server";
import { hash } from "bcryptjs";

import { connectDB, User } from "@chat/db";
import { registerSchema } from "@chat/shared-types";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = registerSchema.safeParse(body);

    if(!result.success) {
      return NextResponse.json({
        message: result.error.issues[0]?.message ?? "Input input",
      },{
        status: 400,
      });
    }

    const { username, email, password } = result.data;

    await connectDB();

    const existingEmail = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingEmail) {
      return NextResponse.json(
        {
          message: "Email already exists",
        },
        {
          status: 409
        }
      )
    }

    const existingUsername = await User.findOne({
      username 
    });

    if (existingUsername) {
      return NextResponse.json(
        {
          message: "Username already exists",
        },
        {
          status: 409
        }
      )
    }
    
    const hashedPassword = await hash(password, 12);


    await User.create({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    return NextResponse.json(
      {
        message: "Account created successfully",
      },
      {
        status: 201,
      }
    );
  } catch {
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}
