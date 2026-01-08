"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { ArrowLeft, MousePointerClick, Users } from "lucide-react";
import Link from "next/link";

import ClickLineChart from "@/components/LineChart";
import SimplePieChart from "@/components/PieChart";

export default function AnalyticsPage({ params }) {
  const { slug } = use(params);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      const res = await fetch(`/api/analytics/${slug}`);
      const json = await res.json();
      setData(json);
      setLoading(false);
    }
    fetchAnalytics();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-sm text-gray-500">
        Loading analytics…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* ===== BREADCRUMB / BACK ===== */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        {/* ===== HEADER ===== */}
        <div className="mb-10">
          <h1 className="text-2xl font-semibold text-gray-900">
            Link Analytics
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Performance for <span className="font-medium">{slug}</span>
          </p>
        </div>

        {/* ===== KPI CARDS ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          <KpiCard
            title="Total Clicks"
            value={data.totalClicks}
            icon={MousePointerClick}
            color="blue"
          />
          <KpiCard
            title="Unique Visitors"
            value={data.uniqueVisitors}
            icon={Users}
            color="teal"
          />
        </div>

        {/* ===== CLICKS OVER TIME ===== */}
        <SectionCard title="Clicks Over Time">
          <ClickLineChart data={data.dailyClicks} />
        </SectionCard>

        {/* ===== PIE CHARTS ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
          <SectionCard title="Devices">
            <SimplePieChart data={data.deviceCount} />
          </SectionCard>

          <SectionCard title="Referrers">
            <SimplePieChart data={data.referrerCount} />
          </SectionCard>
        </div>

        {/* ===== BREAKDOWN TABLES ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
          <DataTable title="Devices Breakdown" data={data.deviceCount} />
          <DataTable title="Referrers Breakdown" data={data.referrerCount} />
        </div>

      </div>
    </div>
  );
}

/* ===================== UI COMPONENTS ===================== */

function KpiCard({ title, value, icon: Icon, color }) {
  const colorMap = {
    blue: "bg-blue-100 text-blue-600",
    teal: "bg-teal-100 text-teal-600"
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-3xl font-semibold text-gray-900 mt-2">
            {value.toLocaleString()}
          </p>
        </div>

        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${colorMap[color]}`}
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
}

function DataTable({ title, data }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-900">
          {title}
        </h3>
      </div>

      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500">
          <tr>
            <th className="px-6 py-3 text-left font-medium">Name</th>
            <th className="px-6 py-3 text-right font-medium">Count</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {Object.entries(data).map(([key, value]) => (
            <tr key={key} className="hover:bg-gray-50 transition">
              <td className="px-6 py-3 capitalize text-gray-700">
                {key}
              </td>
              <td className="px-6 py-3 text-right font-medium text-gray-900">
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
