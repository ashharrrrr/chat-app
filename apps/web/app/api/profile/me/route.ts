import { auth } from "@/auth";
import { connectDB, User } from "@chat/db";
import { updateProfileSchema } from "@chat/shared-types";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const user = await User.findById(session.user.id).select("username image about")

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PUT(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    const formData = await req.formData();
    const aboutRaw = formData.get("about");
    const imageFile = formData.get("image");

    const result = updateProfileSchema.safeParse({
      about: typeof aboutRaw === "string" ? aboutRaw : "",
    });

    if (!result.success) {
      return NextResponse.json({
        message: result.error.issues[0].message ?? "Invalid input",
      }, {
        status: 400
      });
    }

    await connectDB();

    const updateData: {
      about: string;
      image?: string;
    } = {
      about: result.data.about,
    };

    if (imageFile instanceof File && imageFile.size > 0) {

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      if (!allowedTypes.includes(imageFile.type)) {
        return NextResponse.json(
          {
            message:
              "Invalid image type",
          },
          {
            status: 400,
          }
        );
      }
      const MAX_SIZE =
        5 * 1024 * 1024;

      if (imageFile.size > MAX_SIZE) {

        return NextResponse.json(
          {
            message:
              "File Too Large!",
          },
          {
            status: 400,
          }
        );
      }

      const ext = imageFile.name.split(".").pop() || "png";
      const path = `profiles/${session.user.id}/avatar.${ext}`;

      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { error: uploadError } = await supabaseAdmin.storage.from(process.env.SUPABASE_BUCKET || "avatars").upload(path, buffer, {
        contentType: imageFile.type,
        upsert: true,
      });

      if (uploadError) {
        console.error("SUPABASE UPLOAD ERROR:", uploadError);
        return NextResponse.json({
          message: "Failed to upload image"
        }, {
          status: 500
        })
      }

      const { data } = supabaseAdmin.storage.from(process.env.SUPABASE_BUCKET || "avatars").getPublicUrl(path);

      updateData.image = `${data.publicUrl}?v=${Date.now()}`;
    }

    const user = await User.findByIdAndUpdate(session.user.id, updateData, {
      new: true,
    }).select("username image about");

    return NextResponse.json(user);
  } catch (error) {
    console.error("UPDATE PROFILE ERROR: ", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
