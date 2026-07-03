import { z } from "zod";

export const updateProfileSchema = z.object({
  about: z.string().trim().max(160, "About is too long"),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
