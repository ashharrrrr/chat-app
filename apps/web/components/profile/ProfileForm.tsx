"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  updateProfileSchema,
  type UpdateProfileInput,
} from "@chat/shared-types";

import ProfileAvatar from "./ProfileAvatar";

type ProfileFormProps = {
  initialUser: {
    username: string;
    about: string;
    image?: string | null;
  };
};

export default function ProfileForm({ initialUser }: ProfileFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(initialUser.image || "");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      about: initialUser.about ?? "",
    },
  });

  const avatarSrc = useMemo(() => {
    return preview || initialUser.image || "";
  }, [preview, initialUser.image]);

  async function onSubmit(data: UpdateProfileInput) {
    try {
      const formData = new FormData();
      formData.append("about", data.about ?? "");

      if (file) {
        formData.append("image", file);
      }

      const res = await fetch("/api/profile/me", {
        method: "PUT",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.message ?? "Failed to update profile");
        return;
      }

      toast.success("Profile updated");

      if (json.image) {
        setPreview(json.image);
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto w-full max-w-2xl rounded-2xl border bg-background p-6 shadow-sm"
    >
      <div className="flex items-center gap-4">
        <ProfileAvatar
          name={initialUser.username}
          image={avatarSrc}
          size="lg"
        />

        <div>
          <label className="inline-flex cursor-pointer items-center rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted">
            Change photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const selected = e.target.files?.[0];
                if (!selected) return;

                setFile(selected);
                setPreview(URL.createObjectURL(selected));
              }}
            />
          </label>

          <p className="mt-2 text-xs text-muted-foreground">
            JPG, PNG, and WebP supported.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-medium">About</label>
        <textarea
          {...register("about")}
          rows={5}
          placeholder="Write something about yourself..."
          className="w-full rounded-xl border bg-background px-4 py-3 outline-none ring-0 focus:border-primary"
        />
        {errors.about && (
          <p className="mt-2 text-sm text-red-500">{errors.about.message}</p>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl border px-4 py-2 font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save profile"}
        </button>
      </div>
    </form>
  );
}
