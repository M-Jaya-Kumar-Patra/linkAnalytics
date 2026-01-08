import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/db";
import Link from "@/models/Link";
import Click from "@/models/Click";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  // Get user's links
  const links = await Link.find({ userId: session.user.id }).lean();
  const slugs = links.map(link => link.slug);

  // Total clicks
  const totalClicks = await Click.countDocuments({
    slug: { $in: slugs }
  });

  // Unique visitors
  const uniqueVisitors = await Click.distinct("visitorId", {
    slug: { $in: slugs }
  });

  return NextResponse.json({    
    totalClicks,
    uniqueVisitors: uniqueVisitors.length
  });
}
