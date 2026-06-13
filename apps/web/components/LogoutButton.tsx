"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton(){
  return(
    <button className="hover:cursor-pointer hover:bg-red-500" onClick={() => signOut({ redirectTo: "/login", })}>
      Logout
    </button>
  );
}
