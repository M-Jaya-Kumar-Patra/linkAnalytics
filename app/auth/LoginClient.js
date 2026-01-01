"use client";

import { signIn } from "next-auth/react";

export default function LoginClient() {
  return (
    <div style={{ padding: 40, maxWidth: 400, margin: "60px auto" }}>
      <h2 style={{ marginBottom: 20 }}>Login</h2>

      {/* Google Login */}
      <button
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        style={btnPrimary}
      >
        Sign in with Google
      </button>

      <hr style={{ margin: "20px 0" }} />

      {/* Email / Password Login */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const email = e.target.email.value;
          const password = e.target.password.value;

          signIn("credentials", {
            email,
            password,
            callbackUrl: "/dashboard"
          });
        }}
      >
        <input
          name="email"
          placeholder="Email"
          required
          style={input}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          style={input}
        />
        <button type="submit" style={btnSecondary}>
          Login
        </button>
      </form>
    </div>
  );
}

/* simple styles */
const input = {
  width: "100%",
  padding: "10px 12px",
  marginBottom: 10,
  borderRadius: 6,
  border: "1px solid #ccc"
};

const btnPrimary = {
  width: "100%",
  padding: "10px",
  borderRadius: 6,
  background: "#2563eb",
  color: "#fff",
  border: "none",
  cursor: "pointer"
};

const btnSecondary = {
  width: "100%",
  padding: "10px",
  borderRadius: 6,
  background: "#111827",
  color: "#fff",
  border: "none",
  cursor: "pointer"
};
