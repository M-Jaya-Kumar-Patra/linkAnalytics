import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Link from "@/models/Link";
import Click from "@/models/Click";
import { getOrCreateVisitorId } from "@/lib/visitor";

export async function GET(req, { params }) {
  try {
    // params is async in Next.js 15+
    const { slug } = await params;

    await connectDB();

    // 1️⃣ Find the link
    const link = await Link.findOne({ slug: slug });
    if (!link) {
      return NextResponse.json(
        { error: "Link not found" },
        { status: 404 }
      );
    }

    // 2️⃣ Detect device
    const userAgent = req.headers.get("user-agent") || "";
    const device = /mobile/i.test(userAgent) ? "mobile" : "desktop";

    // 3️⃣ Detect referrer
    const referer = req.headers.get("referer");
    let referrer = "direct";

    if (referer) {
      if (referer.includes("whatsapp")) referrer = "whatsapp";
      else if (referer.includes("linkedin")) referrer = "linkedin";
      else if (referer.includes("facebook")) referrer = "facebook";
      else referrer = "other";
    }

    // 4️⃣ Visitor ID (cookie based)
    const visitorId = await getOrCreateVisitorId();

    // 5️⃣ Save click
    await Click.create({
      slug: slug,
      visitorId: visitorId,
      device: device,
      referrer: referrer
    });

    // 6️⃣ Redirect
    return NextResponse.redirect(link.targetUrl);

  } catch (err) {
    console.error("Redirect + tracking error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
