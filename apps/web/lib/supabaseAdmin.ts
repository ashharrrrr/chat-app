import { createClient } from "@supabase/supabase-js";

export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;

  if (!url) {
    throw new Error("SUPABASE_URL is not defined");
  }

  if (!key) {
    throw new Error("SUPABASE_SECRET_KEY is not defined");
  }

  return createClient(url, key);
}
