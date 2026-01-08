// app/dashboard/page.js (SERVER FILE — no "use client")

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";
import Navbar from "@/components/Navbar";


export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth"); // ⛔ BLOCK UNAUTHENTICATED USERS
  }

  return (
    <>
    <Navbar />
    <DashboardClient />
    </>
  )
}
