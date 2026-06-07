"use client";

import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Legend
} from "recharts";

const COLORS = ["#2563eb", "#0f766e", "#f59e0b", "#dc2626", "#7c3aed"];

export default function SimplePieChart({ data }) {
  const chartData = Object.entries(data || {}).map(([name, value]) => ({
    name,
    value
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex h-[16rem] items-center justify-center rounded-2xl bg-slate-50 text-sm font-medium text-slate-500">
        No data yet
      </div>
    );
  }

  return (
    <div className="h-[16rem] w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={56}
            outerRadius={88}
            paddingAngle={3}
          >
            {chartData.map((entry, i) => (
              <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              border: "1px solid #e2e8f0",
              borderRadius: "14px",
              boxShadow: "0 14px 35px rgba(15, 23, 42, 0.12)"
            }}
          />
          <Legend iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
