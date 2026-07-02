import { notFound } from "next/navigation";

import { connectDB, User } from "@chat/db";
import ProfileAvatar from "@/components/profile/ProfileAvatar";

export default async function PublicProfilePage({
  params
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params;

  await connectDB();

  const user = await User.findOne({ username }).select("username image about");

  if (!user) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-10">
      <div className="rounded-2xl border bg-background p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <ProfileAvatar
            name={user.username}
            image={user.image}
            size="lg"
          />

          <div>
            <h1 className="text-2xl font-semibold">{user.username}</h1>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-muted/40 p-4">
          <p className="text-sm font-medium">About</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {user.about || "No about added yet."}
          </p>
        </div>
      </div>
    </main>
  );
}

