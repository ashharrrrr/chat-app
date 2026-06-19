import { auth } from "@/auth";
import { redirect } from "next/navigation";


import ChatShell from "@/components/chat/ChatShell";
import { SocketProvider } from "@/providers/SocketProvider";

export default async function ChatPage() {
  const session =
    await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <SocketProvider>
      <ChatShell currentUserId={session.user.id}/>
    </SocketProvider>
  )
}
