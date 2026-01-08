"use client";

import { signOut } from "next-auth/react";

const LogoutButton = () => {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/auth" })}
      className="
        px-2 py-1 rounded-md
        text-sm font-medium
        text-gray-800 bg-slate-300 hover:bg-slate-200 cursor-pointer 
        transition
      "
    >
      Logout
    </button>
  );
};

export default LogoutButton;
