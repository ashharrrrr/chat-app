"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton(){
  return(
    <button className="rounded-md border px-3 py-1.5 text-sm hover:bg-red-500 hover:text-white transition-colors cursor-pointer" onClick={() => signOut({ redirectTo: "/login", })}>
      Logout
    </button>
  );
}
