"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Mail, Lock, User, ArrowLeft } from "lucide-react";
import Link from "next/link";

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
      setError(data.error);
      setLoading(false);
      return;
    }

    // Auto-login after signup (manual redirect handled by NextAuth)
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/dashboard"
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-sm p-8 space-y-5">

        {/* ===== BACK TO LOGIN ===== */}
        <Link
          href="/auth"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={16} />
          Back to login
        </Link>

        {/* ===== HEADER ===== */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            Create account
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Get started with LinkAnalytics
          </p>
        </div>

        {/* ===== GOOGLE SIGNUP ===== */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="
            w-full
            flex
            items-center
            justify-center
            gap-3
            px-4
            py-2.5
            rounded-lg
            border
            border-gray-300
            bg-white
            text-sm
            font-medium
            text-gray-700
            hover:bg-gray-50
            transition
          "
        >
          <GoogleIcon />
          Continue with Google
        </button>

        {/* ===== DIVIDER ===== */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* ===== CREDENTIAL SIGNUP ===== */}
        <form onSubmit={handleSignup} className="space-y-4">
          {error && (
            <p className="text-sm text-red-600 text-center">
              {error}
            </p>
          )}

          <Input name="name" placeholder="Full name" icon={User} />
          <Input name="email" type="email" placeholder="Email" icon={Mail} />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            icon={Lock}
          />

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              bg-blue-600
              text-white
              py-2.5
              rounded-lg
              text-sm
              font-medium
              hover:bg-blue-700
              transition
              disabled:opacity-60
            "
          >
            {loading ? "Creating..." : "Sign up"}
          </button>
        </form>

        {/* ===== FOOTER ===== */}
        <p className="text-xs text-gray-500 text-center pt-2">
          By signing up, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}

/* ===== INPUT COMPONENT ===== */
function Input({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      <Icon
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        {...props}
        required
        className="
          w-full
          pl-10
          pr-3
          py-2.5
          rounded-lg
          border
          border-gray-300
          text-sm
          focus:ring-2
          focus:ring-blue-500
          outline-none
        "
      />
    </div>
  );
}

/* ===== GOOGLE ICON ===== */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.4 0 6.3 1.2 8.6 3.2l6.4-6.4C34.9 2.6 29.8 0 24 0 14.7 0 6.6 5.4 2.7 13.2l7.6 5.9C12.3 13.1 17.7 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.1 24.6c0-1.6-.1-2.7-.4-3.9H24v7.4h12.6c-.5 3-2.3 5.5-4.9 7.2l7.6 5.9c4.4-4.1 6.8-10.2 6.8-16.6z"/>
      <path fill="#FBBC05" d="M10.3 28.9c-.6-1.7-.9-3.5-.9-5.4s.3-3.7.9-5.4l-7.6-5.9C.9 15.7 0 19.7 0 23.5s.9 7.8 2.7 11.3l7.6-5.9z"/>
      <path fill="#34A853" d="M24 47c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.2-8.3 2.2-6.3 0-11.7-3.6-13.7-8.7l-7.6 5.9C6.6 42.6 14.7 47 24 47z"/>
    </svg>
  );
}
