import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

export default async function ChatPage() {
  const session = await auth();

  console.log("CHAT SESSION: ", session)

  if(!session) {
    redirect("/login");
  }

  return(
    <div>
      Welcome {session.user.username}
      <LogoutButton />
    </div>
  );
}
