import { getSupabaseAdmin } from "../supabaseAdmin";
const SIGNED_URL_TTL_SECONDS = 60 * 60;

function getChatImagesBucket() {
  const bucket = process.env.SUPABASE_CHAT_IMAGES_BUCKET;

  if (!bucket) {
    throw new Error("SUPABASE_CHAT_IMAGES_BUCKET is not defined");
  }
  return bucket;
}

export async function uploadChatImages(
  image: File,
  conversationId: string,
): Promise<string> {

  console.log("ENTER uploadChatImages");
  console.log("SIZE", image.size);

  const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];
  if (!ALLOWED_TYPES.includes(image.type)) {
    throw new Error("Unsupported image type.");
  }
  const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

  console.log("SIZE:", image.size);
  console.log("MAX:", MAX_IMAGE_SIZE);
  console.log("GREATER?", image.size > MAX_IMAGE_SIZE);

  if (image.size > MAX_IMAGE_SIZE) {
    console.log("THROWING");
    throw new Error("Image exceeds the 10 MB limit.");
  }

  console.log("CONTINUING");


  const extension = image.name.split(".").pop() ?? "jpg";
  const imagePath = `conversations/${conversationId}/${crypto.randomUUID()}.${extension}`;

  const buffer = Buffer.from(
    await image.arrayBuffer(),
  );


  const supabaseAdmin = getSupabaseAdmin();
  const { error } = await supabaseAdmin.storage
    .from(getChatImagesBucket())
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

export async function createSignedChatImageUrl(imagePath: string): Promise<string> {
  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }

  const { data, error } = await getSupabaseAdmin().storage.from(getChatImagesBucket()).createSignedUrl(imagePath, SIGNED_URL_TTL_SECONDS);

  if (error) {
    console.error("SIGNED URL ERROR", error);

    throw new Error(error.message);
  }

  return data.signedUrl;
}

export async function createSignedChatImageUrls(imagePaths: string[]): Promise<Map<string, string>> {
  if (imagePaths.length === 0) {
    return new Map();
  }

  const { data, error } = await getSupabaseAdmin().storage.from(getChatImagesBucket()).createSignedUrls(imagePaths, 60 * 60);

  if (error) {
    throw new Error(error.message);
  }

  const signedUrls = new Map<string, string>();

  data.forEach((item, index) => {
    if (item.signedUrl) {
      signedUrls.set(imagePaths[index], item.signedUrl);
    }
  });

  return signedUrls;

}
