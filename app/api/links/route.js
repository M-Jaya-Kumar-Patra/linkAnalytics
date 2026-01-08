import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/db";
import Link from "@/models/Link";
import { generateSlug } from "@/lib/slug";


export async function POST(req) {
  try {
    // 🔐 Check login
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { targetUrl } = await req.json();

    if (!targetUrl) {
      return NextResponse.json(
        { error: "Target URL required" },
        { status: 400 }
      );
    }

    await connectDB();

    // 🔁 Generate unique slug
    let slug;
    let exists = true;

    while (exists) {
      slug = generateSlug();
      exists = await Link.findOne({ slug });
    }

    // 💾 Save link
    const link = await Link.create({
      slug,
      targetUrl,
      userId: session.user.id
    });

    return NextResponse.json({
      success: true,
      link: {
        slug: link.slug,
        targetUrl: link.targetUrl
      }
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}


import Click from "@/models/Click.js"; // ✅ THIS IS YOUR ANALYTICS MODEL

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    // 1️⃣ Fetch user links
    const links = await Link.find({
      userId: session.user.id
    })
      .sort({ createdAt: -1 })
      .lean();

    // 2️⃣ Attach click count
    const linksWithClicks = await Promise.all(
      links.map(async (link) => {
        const clicks = await Click.countDocuments({
          slug: link.slug
        });

        return {
          ...link,
          clicks
        };
      })
    );

    // 3️⃣ Send response
    return NextResponse.json({ links: linksWithClicks });
  } catch (err) {
    console.error("Fetch links error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
