import Image from "next/image";
import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import LogoutButton from "./LogoutButton";

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="relative h-11 w-11 overflow-hidden rounded-2xl bg-blue-50 ring-1 ring-blue-100">
            <Image
              src="/images/logo_icon.png"
              alt="LinkAnalytics"
              fill
              className="object-contain p-1.5"
              priority
            />
          </div>
          <div className="hidden sm:block">
            <p className="text-base font-bold tracking-tight text-slate-950">
              LinkAnalytics
            </p>
            <p className="text-xs font-medium text-slate-500">
              Link intelligence dashboard
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600 md:flex">
            <BarChart3 size={16} className="text-blue-600" />
            Live workspace
          </div>

          {session?.user?.image && (
            <div className="relative h-10 w-10 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
              <Image
                src={session.user.image}
                alt={session.user.name || "Profile"}
                fill
                className="object-cover"
              />
            </div>
          )}

          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
