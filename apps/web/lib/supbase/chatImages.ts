import { getSupabaseAdmin } from "../supabaseAdmin";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export async function uploadChatImages(
  image: File,
  conversationId: string,
): Promise<string> {
  if (!ALLOWED_TYPES.includes(image.type)) {
    throw new Error("Unsupported image type.");
  }

  if (image.size > MAX_IMAGE_SIZE) {
    throw new Error("Image exceeds the 10 MB limit.");
  }

  const extension = image.name.split(".").pop() ?? "jpg";

  const imagePath = `conversations/${conversationId}/${crypto.randomUUID()}.${extension}`;

  const buffer = Buffer.from(
    await image.arrayBuffer(),
  );

  const supabaseAdmin = getSupabaseAdmin();

  const { error } = await supabaseAdmin.storage
    .from("chat-images")
    .upload(
      imagePath,
      buffer,
      {
        contentType: image.type,
      },
    );

  if (error) {
    throw new Error(error.message);
  }

  return imagePath;
}
