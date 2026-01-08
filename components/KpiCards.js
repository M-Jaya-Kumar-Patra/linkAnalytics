"use client";

import { useEffect, useState } from "react";
import { MousePointerClick, Users } from "lucide-react";

const KpiCards = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function fetchKpis() {
      const res = await fetch("/api/dashboard/kpis");
      const data = await res.json();
      setStats(data);
    }

    fetchKpis();
  }, []);

  if (!stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Skeleton />
        <Skeleton />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

      {/* Total Clicks */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">
              Total Clicks
            </p>
            <h2 className="text-2xl font-semibold text-gray-900 mt-1">
              {stats.totalClicks.toLocaleString()}
            </h2>
          </div>

          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            <MousePointerClick size={18} className="text-white" />
          </div>
        </div>
      </div>

      {/* Unique Visitors */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">
              Unique Visitors
            </p>
            <h2 className="text-2xl font-semibold text-gray-900 mt-1">
              {stats.uniqueVisitors.toLocaleString()}
            </h2>
          </div>

          <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center">
            <Users size={18} className="text-white" />
          </div>
        </div>
      </div>

    </div>
  );
};

export default KpiCards;

/* ===== Skeleton Loader ===== */
const Skeleton = () => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
    <div className="flex justify-between">
      <div>
        <div className="h-3 w-24 bg-gray-200 rounded" />
        <div className="h-6 w-32 bg-gray-300 rounded mt-3" />
      </div>
      <div className="h-10 w-10 bg-gray-200 rounded-full" />
    </div>
  </div>
);
