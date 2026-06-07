"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { ArrowLeft, ArrowRight, Lock, Mail, User } from "lucide-react";

export default function SignupClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignup(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Could not create your account.");
      setLoading(false);
      return;
    }

    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/dashboard"
    });
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/70 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-300">LinkAnalytics</p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight">
                Build a smarter link workspace.
              </h1>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                Create trackable links, understand campaign sources, and measure visitor behavior with a clean analytics dashboard.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Stat value="3+" label="Traffic views" />
              <Stat value="OAuth" label="Secure access" />
            </div>
          </div>

          <div className="p-5 sm:p-8 lg:p-10">
            <Link
              href="/auth"
              className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
            >
              <ArrowLeft size={16} />
              Back to login
            </Link>

            <div className="mb-8">
              <p className="text-sm font-semibold text-blue-600">Create account</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">
                Start tracking your links
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Sign up with Google or create a password-protected account.
              </p>
            </div>

            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <GoogleIcon />
              Continue with Google
            </button>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                or
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              {error && (
                <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </p>
              )}

              <Input name="name" placeholder="Full name" icon={User} label="Name" />
              <Input name="email" type="email" placeholder="you@example.com" icon={Mail} label="Email" />
              <Input name="password" type="password" placeholder="At least 6 characters" icon={Lock} label="Password" minLength={6} />

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Creating account..." : "Create account"}
                <ArrowRight size={17} />
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

function Input({ icon: Icon, label, ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <span className="relative mt-2 block">
        <Icon size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          {...props}
          required
          className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
        />
      </span>
    </label>
  );
}

function Stat({ value, label }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-slate-300">{label}</p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.4 0 6.3 1.2 8.6 3.2l6.4-6.4C34.9 2.6 29.8 0 24 0 14.7 0 6.6 5.4 2.7 13.2l7.6 5.9C12.3 13.1 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.1 24.6c0-1.6-.1-2.7-.4-3.9H24v7.4h12.6c-.5 3-2.3 5.5-4.9 7.2l7.6 5.9c4.4-4.1 6.8-10.2 6.8-16.6z" />
      <path fill="#FBBC05" d="M10.3 28.9c-.6-1.7-.9-3.5-.9-5.4s.3-3.7.9-5.4l-7.6-5.9C.9 15.7 0 19.7 0 23.5s.9 7.8 2.7 11.3l7.6-5.9z" />
      <path fill="#34A853" d="M24 47c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.2-8.3 2.2-6.3 0-11.7-3.6-13.7-8.7l-7.6 5.9C6.6 42.6 14.7 47 24 47z" />
    </svg>
  );
}
