"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowRight, BarChart3, Link2, Lock, Mail, Sparkles } from "lucide-react";

export default function LoginClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      email: e.target.email.value,
      password: e.target.password.value
    });

    if (result?.ok) {
      router.push("/dashboard");
      router.refresh();
      return;
    }

    setError("Invalid email or password.");
    setLoading(false);
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            <Sparkles size={16} />
            Professional link tracking
          </div>

          <div className="space-y-5">
            <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Turn every shared link into measurable insight.
            </h1>
            <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Create short links, capture visitor behavior, and understand which channels drive clicks from one clean analytics workspace.
            </p>
          </div>

          <div className="grid max-w-2xl gap-4 sm:grid-cols-3">
            <Feature icon={Link2} label="Short links" value="Instant" />
            <Feature icon={BarChart3} label="Analytics" value="Live-ready" />
            <Feature icon={Lock} label="Access" value="Protected" />
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70 sm:p-8">
          <div className="mb-8">
            <p className="text-sm font-semibold text-blue-600">Welcome back</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">
              Sign in to LinkAnalytics
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Manage your links and review performance.
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

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </p>
            )}

            <Input icon={Mail} name="email" type="email" label="Email" placeholder="you@example.com" />
            <Input icon={Lock} name="password" type="password" label="Password" placeholder="Enter your password" />

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Signing in..." : "Sign in"}
              <ArrowRight size={17} />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            New here?{" "}
            <Link href="/auth/signup" className="font-bold text-blue-600 hover:text-blue-700">
              Create an account
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}

function Feature({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
      <Icon size={18} className="text-blue-600" />
      <p className="mt-3 text-lg font-bold text-slate-950">{value}</p>
      <p className="text-sm font-medium text-slate-500">{label}</p>
    </div>
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
