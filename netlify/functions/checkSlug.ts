import { Handler } from "@netlify/functions";
import { db, jsonResponse } from "./_lib/firebaseAdmin";

export const handler: Handler = async (event) => {
  const slug = event.queryStringParameters?.slug;
  if (!slug) return jsonResponse(400, { error: "Thiếu slug" });

  const snap = await db
    .collection("cards")
    .where("slug", "==", slug)
    .limit(1)
    .get();
  return jsonResponse(200, { available: snap.empty });
};
