import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import LoginClient from "./LoginClient";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  // ✅ If already logged in → dashboard
  if (session) {
    redirect("/dashboard");
  }

  return <LoginClient />;
}
