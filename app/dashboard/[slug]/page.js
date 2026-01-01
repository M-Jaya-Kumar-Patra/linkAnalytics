"use client";

import { useEffect, useState } from "react";
import { use } from "react";
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

  if (loading) return <p>Loading analytics...</p>;

  return (
    <div style={{ padding: 30 }}>
      <h1>Analytics for {slug}</h1>

      <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
        <Card title="Total Clicks" value={data.totalClicks} />
        <Card title="Unique Visitors" value={data.uniqueVisitors} />
      </div>

      <h3 style={{ marginTop: 40 }}>Clicks Over Time</h3>
<ClickLineChart data={data.dailyClicks} />

<h3 style={{ marginTop: 40 }}>Devices</h3>
<SimplePieChart data={data.deviceCount} />

<h3 style={{ marginTop: 40 }}>Referrers</h3>
<SimplePieChart data={data.referrerCount} />

      <h3 style={{ marginTop: 30 }}>Devices</h3>
      <List data={data.deviceCount} />

      <h3 style={{ marginTop: 30 }}>Referrers</h3>
      <List data={data.referrerCount} />
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div
      style={{
        padding: 20,
        border: "1px solid #ddd",
        borderRadius: 8,
        minWidth: 150
      }}
    >
      <h4>{title}</h4>
      <p style={{ fontSize: 24, fontWeight: "bold" }}>{value}</p>
    </div>
  );
}

function List({ data }) {
  return (
    <ul>
      {Object.entries(data).map(([key, value]) => (
        <li key={key}>
          {key}: {value}
        </li>
      ))}
    </ul>
  );
}
