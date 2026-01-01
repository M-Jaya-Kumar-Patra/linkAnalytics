import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Click from "@/models/Click";

export async function GET(req, { params }) {
  try {
    const { slug } = await params;

    await connectDB();

    const clicks = await Click.find({ slug: slug });

    const totalClicks = clicks.length;

    const uniqueVisitors = new Set(
      clicks.map(c => c.visitorId)
    ).size;

    const deviceCount = clicks.reduce((acc, c) => {
      acc[c.device] = (acc[c.device] || 0) + 1;
      return acc;
    }, {});

    const referrerCount = clicks.reduce((acc, c) => {
      acc[c.referrer] = (acc[c.referrer] || 0) + 1;
      return acc;
    }, {});

    // 📅 Daily clicks (last 7 days)
    const dailyMap = {};

    clicks.forEach(c => {
      const day = new Date(c.createdAt).toISOString().slice(0, 10);
      dailyMap[day] = (dailyMap[day] || 0) + 1;
    });

    const dailyClicks = Object.entries(dailyMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json({
      totalClicks,
      uniqueVisitors,
      deviceCount,
      referrerCount,
      dailyClicks
    });

  } catch (err) {
    console.error("Analytics error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
