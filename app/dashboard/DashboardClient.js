"use client";

import { useEffect, useState } from "react";
import KpiCards from "@/components/KpiCards";

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
    setLinks(prev => [data.link, ...prev]);
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
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-10">

        {/* ===== PAGE TITLE ===== */}
        <div className="mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage links and track performance
          </p>
        </div>

        {/* ===== TOP GRID ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6">

          {/* CREATE LINK */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <h3 className="text-md font-semibold text-gray-900">
              Create a new link
            </h3>

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <input
                placeholder="https://example.com"
                value={url}
                onChange={e => setUrl(e.target.value)}
                className="
                  flex-1
                  px-4 py-2.5
                  rounded-lg
                  border border-gray-300
                  text-sm
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

              <button
                onClick={createLink}
                className="
                  px-6 py-2.5
                  rounded-lg
                  text-sm
                  font-medium
                  text-white
                  bg-blue-600
                  hover:bg-blue-700
                  transition
                "
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>

          {/* KPI CARDS */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <KpiCards />
          </div>
        </div>

        {/* ===== TOP LINKS ===== */}
        <div className="mt-5 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
            <h2 className="text-lg font-bold text-gray-900">
              Link Library
            </h2>
            <button className="text-gray-600 hover:text-gray-600 text-lg">
              Total links created: <span className="text-slate-900 font-bold">{links.length}</span> 
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">
                    Short Link
                  </th>
                  <th className="px-6 py-3 text-left font-medium">
                    Original URL
                  </th>
                  <th className="px-6 py-3 text-right font-medium">
                    Clicks
                  </th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {links.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-10 text-center text-sm text-gray-500"
                    >
                      No links created yet
                    </td>
                  </tr>
                )}

                {links.map(link => (
                  <tr
                    key={link._id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-3 font-medium text-gray-900">
                      <a
                        href={`/l/${link.slug}`}
                        target="_blank"
                        className="hover:underline"
                      >
                        LinkAnalytics.app/{link.slug}
                      </a>
                    </td>

                    <td className="px-6 py-3 text-gray-500 max-w-[360px] truncate">
                      {link.targetUrl}
                    </td>

                    <td className="px-6 py-3 text-right font-medium text-gray-700">
                      {link.clicks || 0}
                    </td>

                    <td className="px-6 py-3 text-right">
                      <a
                        href={`/dashboard/${link.slug}`}
                        className="
                          inline-flex
                          items-center
                          px-3 py-1.5
                          text-xs
                          font-medium
                          text-blue-600
                          bg-blue-50
                          rounded-md
                          hover:bg-blue-100
                        "
                      >
                        View Analytics →
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
