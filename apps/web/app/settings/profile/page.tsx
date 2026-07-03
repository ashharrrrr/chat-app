import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { connectDB, User } from "@chat/db";
import ProfileForm from "@/components/profile/ProfileForm";

export default async function ProfileSettingsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  await connectDB();

  const user = await User.findById(session.user.id).select("username image about");

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <ProfileForm
        initialUser={{
          username: user.username,
          about: user.about ?? "",
          image: user.image ?? "",
        }}
      />
    </main>
  );
}
