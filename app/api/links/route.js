import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/db";
import Link from "@/models/Link";
import Click from "@/models/Click";
import { generateSlug } from "@/lib/slug";

function normalizeUrl(value) {
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { targetUrl } = await req.json();
    const normalizedUrl = normalizeUrl(targetUrl);

    if (!normalizedUrl) {
      return NextResponse.json(
        { error: "Enter a valid http or https URL" },
        { status: 400 }
      );
    }

    await connectDB();

    let slug;
    let exists = true;
    let attempts = 0;

    while (exists) {
      attempts += 1;
      if (attempts > 10) {
        return NextResponse.json(
          { error: "Could not generate a unique link. Please try again." },
          { status: 500 }
        );
      }

      slug = generateSlug();
      exists = await Link.findOne({ slug });
    }

    const link = await Link.create({
      slug,
      targetUrl: normalizedUrl,
      userId: session.user.id
    });

    return NextResponse.json({
      success: true,
      link: {
        _id: link._id.toString(),
        slug: link.slug,
        targetUrl: link.targetUrl,
        clicks: 0,
        createdAt: link.createdAt
      }
    });
  } catch (err) {
    console.error("Create link error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const links = await Link.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    const linksWithClicks = await Promise.all(
      links.map(async (link) => {
        const clicks = await Click.countDocuments({ slug: link.slug });
        return {
          ...link,
          _id: link._id.toString(),
          userId: link.userId.toString(),
          clicks
        };
      })
    );

    return NextResponse.json({ links: linksWithClicks });
  } catch (err) {
    console.error("Fetch links error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
