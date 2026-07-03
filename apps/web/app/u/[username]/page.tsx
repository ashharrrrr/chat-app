import { notFound } from "next/navigation";

import { connectDB, User } from "@chat/db";
import ProfileAvatar from "@/components/profile/ProfileAvatar";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  await connectDB();

  const user = await User.findOne({ username }).select("username image about");

  if (!user) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10">
      <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-gray-700 bg-gray-900 shadow-2xl">
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-gray-900 to-gray-800 px-8 py-10 sm:px-12">
          <div className="absolute inset-x-0 bottom-0 h-28 bg-white/5 blur-3xl" />
          <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
            <ProfileAvatar
              name={user.username}
              image={user.image}
              size="lg"
              className="border-4 border-gray-800 shadow-xl"
            />

            <div className="sm:ml-6">
              <h1 className="text-4xl font-semibold text-white">
                {user.username}
              </h1>
              <p className="mt-2 text-sm text-gray-400">@{user.username}</p>
              <p className="mt-5 max-w-2xl text-base leading-7 text-gray-300 sm:mt-6">
                {user.about || "This user hasn't added an about yet."}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 px-8 py-8 sm:px-12">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-gray-700 bg-gray-800 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
                Profile
              </p>
              <p className="mt-4 text-lg font-semibold text-white">Username</p>
              <p className="mt-2 text-sm text-gray-400">@{user.username}</p>
            </div>

            <div className="rounded-3xl border border-gray-700 bg-gray-800 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
                About
              </p>
              <p className="mt-4 text-base leading-7 text-gray-300">
                {user.about || "No about added yet."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
