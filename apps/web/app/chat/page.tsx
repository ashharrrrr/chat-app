import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ChatPage() {
  const session = await auth();

  if(!session) {
    redirect("/login");
  }

  return(
    <div>
      Welcome {session.user.username}
    </div>
  );
}
