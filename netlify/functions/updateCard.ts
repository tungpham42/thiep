import { Handler } from "@netlify/functions";
import { db, verifyToken, jsonResponse } from "./_lib/firebaseAdmin";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "PUT")
    return jsonResponse(405, { error: "Method not allowed" });

  const user = await verifyToken(event.headers.authorization);
  if (!user) return jsonResponse(401, { error: "Unauthorized" });

  const id = event.queryStringParameters?.id;
  if (!id) return jsonResponse(400, { error: "Thiếu id" });

  const data = JSON.parse(event.body || "{}");

  // Nếu đổi slug → check trùng
  if (data.slug) {
    const dup = await db
      .collection("cards")
      .where("slug", "==", data.slug)
      .limit(2)
      .get();
    if (!dup.empty && dup.docs.some((d) => d.id !== id)) {
      return jsonResponse(409, { error: "Slug đã tồn tại" });
    }
  }

  const payload = { ...data };
  delete payload.id;
  delete payload.createdAt;
  delete payload.views;

  await db.collection("cards").doc(id).update(payload);
  return jsonResponse(200, { ok: true });
};
