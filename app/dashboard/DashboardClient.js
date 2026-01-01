"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

export default function DashboardClient() {
  const [url, setUrl] = useState("");
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);

  async function createLink() {
    if (!url) return;

    setLoading(true);

    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetUrl: url })
    });

    const data = await res.json();
    setLinks([data.link, ...links]);
    setUrl("");
    setLoading(false);
  }

  useEffect(() => {
    async function fetchLinks() {
      const res = await fetch("/api/links");
      const data = await res.json();
      setLinks(data.links || []);
    }
    fetchLinks();
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: "600" }}>Dashboard</h1>
          <p style={{ color: "#555" }}>Create and track your links</p>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/auth" })}
          style={logoutButtonStyle}
        >
          Logout
        </button>
      </div>

      {/* Create Link */}
      <div style={cardStyle}>
        <h3>Create a new link</h3>
        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <input
            placeholder="https://example.com"
            value={url}
            onChange={e => setUrl(e.target.value)}
            style={inputStyle}
          />
          <button onClick={createLink} style={buttonStyle}>
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>

      {/* Links */}
      <h2 style={{ marginTop: 40 }}>Your Links</h2>

      {links.map(link => (
        <div key={link._id} style={linkCardStyle}>
          <div>
            <a href={`/l/${link.slug}`} target="_blank">
              /l/{link.slug}
            </a>
            <p style={{ fontSize: 13, color: "#777" }}>{link.targetUrl}</p>
          </div>

          <a href={`/dashboard/${link.slug}`}>
            View analytics →
          </a>
        </div>
      ))}
    </div>
  );
}

/* styles stay same */

const cardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: 20,
  background: "#fff"
};

const linkCardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: 16,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 12,
  background: "#fff"
};

const inputStyle = {
  flex: 1,
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #d1d5db",
  fontSize: 14
};

const buttonStyle = {
  padding: "10px 18px",
  borderRadius: 8,
  background: "#2563eb",
  color: "#fff",
  border: "none",
  cursor: "pointer"
};

const analyticsBtnStyle = {
  color: "#2563eb",
  fontWeight: 500,
  textDecoration: "none"
};

const logoutButtonStyle = {
  padding: "8px 14px",
  borderRadius: 8,
  background: "#ef4444", // red
  color: "#fff",
  border: "none",
  cursor: "pointer",
  fontSize: 14
};
