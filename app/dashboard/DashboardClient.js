"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Check,
  Copy,
  ExternalLink,
  Link2,
  MousePointerClick,
  Plus,
  Search,
  Users
} from "lucide-react";

export default function DashboardClient() {
  const [url, setUrl] = useState("");
  const [links, setLinks] = useState([]);
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState("");

  const filteredLinks = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return links;
    return links.filter((link) => {
      return (
        link.slug.toLowerCase().includes(value) ||
        link.targetUrl.toLowerCase().includes(value)
      );
    });
  }, [links, query]);

  async function createLink(e) {
    e.preventDefault();
    setError("");

    if (!url.trim()) {
      setError("Enter a destination URL first.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetUrl: url.trim() })
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Could not create this link.");
      setLoading(false);
      return;
    }

    setLinks((prev) => [data.link, ...prev]);
    setKpis((prev) => prev || { totalClicks: 0, uniqueVisitors: 0 });
    setUrl("");
    setLoading(false);
  }

  async function copyLink(slug) {
    const shortUrl = `${window.location.origin}/l/${slug}`;
    await navigator.clipboard.writeText(shortUrl);
    setCopied(slug);
    setTimeout(() => setCopied(""), 1600);
  }

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const [linksRes, kpisRes] = await Promise.all([
          fetch("/api/links"),
          fetch("/api/dashboard/kpis")
        ]);

        const linksData = await linksRes.json();
        const kpisData = await kpisRes.json();

        if (!active) return;

        setLinks(linksData.links || []);
        setKpis(kpisData);
      } catch {
        if (active) setError("Could not load dashboard data.");
      } finally {
        if (active) setInitialLoading(false);
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const totalLinks = links.length;
  const totalClicks = kpis?.totalClicks || 0;
  const uniqueVisitors = kpis?.uniqueVisitors || 0;

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">
                  <BarChart3 size={15} />
                  Analytics workspace
                </p>
                <h1 className="mt-5 max-w-2xl text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  Create trackable links and measure what performs.
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                  Generate short URLs, share them anywhere, and monitor clicks, visitors, device behavior, and referral sources.
                </p>
              </div>
            </div>

            <form onSubmit={createLink} className="mt-8">
              <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-2 sm:flex-row">
                <div className="relative flex-1">
                  <Link2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://your-destination.com/page"
                    className="h-12 w-full rounded-xl border border-transparent bg-white pl-11 pr-4 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Plus size={17} />
                  {loading ? "Creating..." : "Create link"}
                </button>
              </div>
              {error && (
                <p className="mt-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </p>
              )}
            </form>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <MetricCard icon={Link2} label="Total links" value={totalLinks} tone="blue" loading={initialLoading} />
            <MetricCard icon={MousePointerClick} label="Total clicks" value={totalClicks} tone="teal" loading={initialLoading} />
            <MetricCard icon={Users} label="Unique visitors" value={uniqueVisitors} tone="amber" loading={initialLoading} />
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Link library</h2>
              <p className="mt-1 text-sm text-slate-500">
                Manage every tracked link from one responsive workspace.
              </p>
            </div>
            <div className="relative w-full sm:max-w-xs">
              <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search links"
                className="h-11 w-full rounded-full border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>

          {initialLoading ? (
            <div className="grid gap-4 p-5 sm:p-6">
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </div>
          ) : filteredLinks.length === 0 ? (
            <EmptyState hasLinks={links.length > 0} />
          ) : (
            <div className="overflow-hidden">
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-6 py-4">Short link</th>
                      <th className="px-6 py-4">Destination</th>
                      <th className="px-6 py-4 text-right">Clicks</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLinks.map((link) => (
                      <LinkRow
                        key={link._id || link.slug}
                        link={link}
                        copied={copied === link.slug}
                        onCopy={() => copyLink(link.slug)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-4 p-5 lg:hidden">
                {filteredLinks.map((link) => (
                  <MobileLinkCard
                    key={link._id || link.slug}
                    link={link}
                    copied={copied === link.slug}
                    onCopy={() => copyLink(link.slug)}
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function MetricCard({ icon: Icon, label, value, tone, loading }) {
  const toneMap = {
    blue: "bg-blue-50 text-blue-600",
    teal: "bg-teal-50 text-teal-600",
    amber: "bg-amber-50 text-amber-600"
  };

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">
            {loading ? "--" : value.toLocaleString()}
          </p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${toneMap[tone]}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

function LinkRow({ link, copied, onCopy }) {
  return (
    <tr className="transition hover:bg-slate-50">
      <td className="px-6 py-4">
        <a
          href={`/l/${link.slug}`}
          target="_blank"
          className="inline-flex items-center gap-2 font-bold text-slate-950 hover:text-blue-600"
        >
          /l/{link.slug}
          <ExternalLink size={15} />
        </a>
      </td>
      <td className="max-w-[30rem] truncate px-6 py-4 text-slate-500">
        {link.targetUrl}
      </td>
      <td className="px-6 py-4 text-right font-bold text-slate-900">
        {(link.clicks || 0).toLocaleString()}
      </td>
      <td className="px-6 py-4">
        <div className="flex justify-end gap-2">
          <button
            onClick={onCopy}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-slate-200 px-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? "Copied" : "Copy"}
          </button>
          <Link
            href={`/dashboard/${link.slug}`}
            className="inline-flex h-9 items-center gap-2 rounded-full bg-slate-950 px-3 text-xs font-bold text-white transition hover:bg-slate-800"
          >
            Analytics
            <ArrowRight size={15} />
          </Link>
        </div>
      </td>
    </tr>
  );
}

function MobileLinkCard({ link, copied, onCopy }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <a
            href={`/l/${link.slug}`}
            target="_blank"
            className="font-bold text-slate-950 hover:text-blue-600"
          >
            /l/{link.slug}
          </a>
          <p className="mt-1 truncate text-sm text-slate-500">{link.targetUrl}</p>
        </div>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">
          {(link.clicks || 0).toLocaleString()}
        </span>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          onClick={onCopy}
          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-600"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "Copied" : "Copy"}
        </button>
        <Link
          href={`/dashboard/${link.slug}`}
          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-slate-950 text-sm font-bold text-white"
        >
          Analytics
          <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}

function EmptyState({ hasLinks }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        <Link2 size={24} />
      </div>
      <h3 className="mt-5 text-lg font-bold text-slate-950">
        {hasLinks ? "No matching links" : "Create your first tracked link"}
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
        {hasLinks
          ? "Try a different search term to find the link you need."
          : "Paste a destination URL above and LinkAnalytics will create a short tracking link."}
      </p>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div className="h-4 w-40 rounded bg-slate-200" />
      <div className="mt-3 h-3 w-full max-w-lg rounded bg-slate-200" />
    </div>
  );
}
