import Link from "next/link";

import { auth } from "@/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-900 px-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4">Chat App</h1>
          <p className="text-xl text-gray-300">
            Real-time messaging built with Next.js, Socket.io, MongoDB, React
            Query and Tailwind.
          </p>
        </div>

        {session ? (
          <div className="bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <p className="text-lg text-gray-200 mb-6">
              Welcome back,{" "}
              <span className="font-bold text-indigo-400">
                {session.user?.username}
              </span>
            </p>

            <Link
              href="/chat"
              className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
              Open Chats
            </Link>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg shadow-lg p-8">
            <p className="text-center text-gray-300 mb-8">
              Get started with your account
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="flex-1 sm:flex-auto bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors text-center">
                Login
              </Link>

              <Link
                href="/register"
                className="flex-1 sm:flex-auto bg-gray-700 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors text-center border border-gray-600">
                Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
