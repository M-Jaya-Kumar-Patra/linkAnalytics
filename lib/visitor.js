import { cookies } from "next/headers";
import { randomUUID } from "crypto";

export async function getOrCreateVisitorId() {
  const cookieStore = await cookies();

  let visitorId = cookieStore.get("visitorId")?.value;

  if (!visitorId) {
    visitorId = randomUUID();

    cookieStore.set("visitorId", visitorId, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 365 // 1 year
    });
  }

  return visitorId;
}
