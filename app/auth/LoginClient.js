"use client";

import { signIn } from "next-auth/react";
import { Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginClient() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4  py-8">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-sm p-8">
        {/* ===== HEADER ===== */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">Welcome back</h2>
          <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
        </div>

        {/* ===== GOOGLE LOGIN ===== */}
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
          Sign in with Google
        </button>

        {/* ===== DIVIDER ===== */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* ===== CREDENTIAL LOGIN ===== */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const email = e.target.email.value;
            const password = e.target.password.value;

            const result = signIn("credentials", {
              email,
              password,
            });

            if (result?.ok) {
              router.push("/dashboard");
            }
          }}
          className="space-y-4"
        >
          {/* Email */}
          <div>
            <label className="text-xs font-medium text-gray-600">Email</label>
            <div className="relative mt-1">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="
                  w-full
                  pl-10
                  pr-3
                  py-2.5
                  rounded-lg
                  border
                  border-gray-300
                  text-sm
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-medium text-gray-600">
              Password
            </label>
            <div className="relative mt-1">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="
                  w-full
                  pl-10
                  pr-3
                  py-2.5
                  rounded-lg
                  border
                  border-gray-300
                  text-sm
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="
              w-full
              mt-2
              px-4
              py-2.5
              rounded-lg
              bg-blue-600
              text-white
              text-sm
              font-medium
              hover:bg-blue-700
              transition
            "
          >
            Sign in
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-4">
          Don’t have an account?{" "}
          <a href="/auth/signup" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>

        {/* ===== FOOTER ===== */}
        <p className="text-xs text-gray-500 text-center mt-6">
          © {new Date().getFullYear()} LinkAnalytics. All rights reserved.
        </p>
      </div>
    </div>
  );
}

/* ===== GOOGLE ICON ===== */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path
        fill="#EA4335"
        d="M24 9.5c3.4 0 6.3 1.2 8.6 3.2l6.4-6.4C34.9 2.6 29.8 0 24 0 14.7 0 6.6 5.4 2.7 13.2l7.6 5.9C12.3 13.1 17.7 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.1 24.6c0-1.6-.1-2.7-.4-3.9H24v7.4h12.6c-.5 3-2.3 5.5-4.9 7.2l7.6 5.9c4.4-4.1 6.8-10.2 6.8-16.6z"
      />
      <path
        fill="#FBBC05"
        d="M10.3 28.9c-.6-1.7-.9-3.5-.9-5.4s.3-3.7.9-5.4l-7.6-5.9C.9 15.7 0 19.7 0 23.5s.9 7.8 2.7 11.3l7.6-5.9z"
      />
      <path
        fill="#34A853"
        d="M24 47c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.2-8.3 2.2-6.3 0-11.7-3.6-13.7-8.7l-7.6 5.9C6.6 42.6 14.7 47 24 47z"
      />
    </svg>
  );
}
