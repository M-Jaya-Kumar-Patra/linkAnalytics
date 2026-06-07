import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/db";
import Click from "@/models/Click";
import Link from "@/models/Link";

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;

    await connectDB();

    const link = await Link.findOne({
      slug,
      userId: session.user.id
    }).lean();

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    const clicks = await Click.find({ slug }).lean();
    const totalClicks = clicks.length;
    const uniqueVisitors = new Set(clicks.map((click) => click.visitorId)).size;

    const deviceCount = clicks.reduce((acc, click) => {
      acc[click.device] = (acc[click.device] || 0) + 1;
      return acc;
    }, {});

    const referrerCount = clicks.reduce((acc, click) => {
      acc[click.referrer] = (acc[click.referrer] || 0) + 1;
      return acc;
    }, {});

    const dailyMap = {};
    clicks.forEach((click) => {
      const day = new Date(click.createdAt).toISOString().slice(0, 10);
      dailyMap[day] = (dailyMap[day] || 0) + 1;
    });

    const dailyClicks = Object.entries(dailyMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json({
      link: {
        slug: link.slug,
        targetUrl: link.targetUrl,
        createdAt: link.createdAt
      },
      totalClicks,
      uniqueVisitors,
      deviceCount,
      referrerCount,
      dailyClicks
    });
  } catch (err) {
    console.error("Analytics error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
