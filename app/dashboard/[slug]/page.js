"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  ExternalLink,
  Link2,
  MousePointerClick,
  Users
} from "lucide-react";

import ClickLineChart from "@/components/LineChart";
import SimplePieChart from "@/components/PieChart";

export default function AnalyticsPage({ params }) {
  const { slug } = use(params);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAnalytics() {
      const res = await fetch(`/api/analytics/${slug}`);
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Could not load analytics.");
        setLoading(false);
        return;
      }

      setData(json);
      setLoading(false);
    }

    fetchAnalytics();
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-5">
          <div className="h-8 w-40 animate-pulse rounded bg-slate-200" />
          <div className="h-56 animate-pulse rounded-[2rem] bg-white shadow-lg shadow-slate-200/60" />
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="h-80 animate-pulse rounded-[2rem] bg-white shadow-lg shadow-slate-200/60" />
            <div className="h-80 animate-pulse rounded-[2rem] bg-white shadow-lg shadow-slate-200/60" />
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-red-100 bg-white p-8 text-center shadow-xl shadow-slate-200/60">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <Link2 size={24} />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-slate-950">Analytics unavailable</h1>
          <p className="mt-2 text-sm text-slate-500">{error}</p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-bold text-white"
          >
            <ArrowLeft size={16} />
            Back to dashboard
          </Link>
        </div>
      </main>
    );
  }

  const createdAt = data.link?.createdAt
    ? new Date(data.link.createdAt).toLocaleDateString()
    : "Unknown";

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-slate-950"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">
                <Link2 size={15} />
                /l/{slug}
              </p>
              <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Link analytics
              </h1>
              <a
                href={data.link?.targetUrl}
                target="_blank"
                className="mt-3 inline-flex max-w-full items-center gap-2 truncate text-sm font-semibold text-slate-500 hover:text-blue-600"
              >
                <span className="truncate">{data.link?.targetUrl}</span>
                <ExternalLink size={15} className="shrink-0" />
              </a>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600">
              <CalendarDays size={16} />
              Created {createdAt}
            </div>
          </div>
        </section>

        <section className="grid gap-5 sm:grid-cols-2">
          <MetricCard
            title="Total clicks"
            value={data.totalClicks}
            icon={MousePointerClick}
            tone="blue"
          />
          <MetricCard
            title="Unique visitors"
            value={data.uniqueVisitors}
            icon={Users}
            tone="teal"
          />
        </section>

        <Section title="Clicks over time" subtitle="Daily click volume for this short link.">
          {data.dailyClicks.length === 0 ? (
            <EmptyChart />
          ) : (
            <ClickLineChart data={data.dailyClicks} />
          )}
        </Section>

        <section className="grid gap-5 lg:grid-cols-2">
          <Section title="Devices" subtitle="Mobile and desktop traffic split.">
            <SimplePieChart data={data.deviceCount} />
          </Section>
          <Section title="Referrers" subtitle="Where visitors came from before clicking.">
            <SimplePieChart data={data.referrerCount} />
          </Section>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <Breakdown title="Device breakdown" data={data.deviceCount} />
          <Breakdown title="Referrer breakdown" data={data.referrerCount} />
        </section>
      </div>
    </main>
  );
}

function MetricCard({ title, value, icon: Icon, tone }) {
  const toneMap = {
    blue: "bg-blue-50 text-blue-600",
    teal: "bg-teal-50 text-teal-600"
  };

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <p className="mt-2 text-4xl font-bold text-slate-950">
            {value.toLocaleString()}
          </p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${toneMap[tone]}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60 sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-950">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function Breakdown({ title, data }) {
  const entries = Object.entries(data || {});

  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
        <h2 className="text-sm font-bold text-slate-950">{title}</h2>
      </div>
      {entries.length === 0 ? (
        <p className="px-6 py-8 text-sm text-slate-500">No data yet.</p>
      ) : (
        <table className="w-full text-sm">
          <tbody className="divide-y divide-slate-100">
            {entries.map(([key, value]) => (
              <tr key={key}>
                <td className="px-5 py-4 font-semibold capitalize text-slate-600 sm:px-6">
                  {key}
                </td>
                <td className="px-5 py-4 text-right font-bold text-slate-950 sm:px-6">
                  {value.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="flex h-[18rem] items-center justify-center rounded-2xl bg-slate-50 text-sm font-medium text-slate-500">
      No clicks have been recorded yet.
    </div>
  );
}
