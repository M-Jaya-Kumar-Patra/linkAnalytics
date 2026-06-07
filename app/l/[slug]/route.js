import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import Link from "@/models/Link";
import Click from "@/models/Click";
import { getOrCreateVisitorId } from "@/lib/visitor";

export async function GET(req, { params }) {
  try {
    const { slug } = await params;

    await connectDB();

    const link = await Link.findOne({ slug });
    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    const userAgent = req.headers.get("user-agent") || "";
    const device = /mobile|android|iphone|ipad|ipod/i.test(userAgent)
      ? "mobile"
      : "desktop";

    const referer = req.headers.get("referer");
    let referrer = "direct";

    if (referer) {
      if (referer.includes("whatsapp")) referrer = "whatsapp";
      else if (referer.includes("linkedin")) referrer = "linkedin";
      else if (referer.includes("facebook")) referrer = "facebook";
      else referrer = "other";
    }

    const visitorId = await getOrCreateVisitorId();

    await Click.create({
      slug,
      visitorId,
      device,
      referrer
    });

    return NextResponse.redirect(link.targetUrl);
  } catch (err) {
    console.error("Redirect tracking error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
