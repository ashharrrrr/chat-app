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
      className="mx-auto w-full max-w-2xl bg-gray-800 shadow-lg rounded-lg p-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <ProfileAvatar
          name={initialUser.username}
          image={avatarSrc}
          size="lg"
        />

        <div>
          <label className="inline-flex cursor-pointer items-center rounded-md border border-gray-700 bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600 transition-colors">
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

          <p className="mt-2 text-sm text-gray-400">
            JPG, PNG, and WebP supported.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-medium text-gray-200">
          About
        </label>
        <textarea
          {...register("about")}
          rows={5}
          placeholder="Write something about yourself..."
          className="w-full rounded-md border border-gray-700 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.about && (
          <p className="mt-2 text-sm text-red-400">{errors.about.message}</p>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-indigo-600 px-5 py-2.5 font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : "Save profile"}
        </button>
      </div>
    </form>
  );
}
