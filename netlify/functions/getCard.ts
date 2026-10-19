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
  if (snap.empty) return jsonResponse(404, { error: "Không tìm thấy thiệp" });

  const doc = snap.docs[0];
  const data = doc.data();

  // Tăng views (không block)
  doc.ref.update({ views: (data.views || 0) + 1 }).catch(() => {});

  return jsonResponse(200, { id: doc.id, ...data });
};
