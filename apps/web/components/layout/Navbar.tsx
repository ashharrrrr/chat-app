import Link from "next/link";

import { auth } from "@/auth";

import LogoutButton from "@/components/LogoutButton";

export default async function Navbar() {
  const session = await auth();

  return (
    <header className="border-b border-gray-700 bg-gray-800">
      <div
        className="
          mx-auto
          flex
          h-16
          max-w-7xl
          items-center
          justify-between
          px-6
        ">
        <Link href="/" className="font-bold text-lg text-white">
          Chat App
        </Link>

        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link
                href="/chat"
                className="text-white hover:text-gray-300 transition-colors">
                Chats
              </Link>

              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-white hover:text-gray-300 transition-colors">
                Login
              </Link>

              <Link
                href="/register"
                className="text-white hover:text-gray-300 transition-colors">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
