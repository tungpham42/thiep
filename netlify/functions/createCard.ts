import { Handler } from "@netlify/functions";
import { customAlphabet } from "nanoid";
import { db, verifyToken, jsonResponse } from "./_lib/firebaseAdmin";

const nano = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 6);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST")
    return jsonResponse(405, { error: "Method not allowed" });

  const user = await verifyToken(event.headers.authorization);
  if (!user) return jsonResponse(401, { error: "Unauthorized" });

  try {
    const data = JSON.parse(event.body || "{}");

    if (!data.message || !data.recipientName) {
      return jsonResponse(400, { error: "Thiếu thông tin bắt buộc" });
    }

    let slug: string = data.slug?.trim() || nano();
    const slugCheck = await db
      .collection("cards")
      .where("slug", "==", slug)
      .limit(1)
      .get();
    if (!slugCheck.empty)
      return jsonResponse(409, { error: "Slug đã tồn tại" });

    const doc = {
      slug,
      recipientName: data.recipientName,
      senderName: data.senderName || "",
      message: data.message,
      fontFamily: data.fontFamily || "Playfair Display",
      flowerSvg: data.flowerSvg,
      animation: data.animation || "bloom",
      theme: data.theme,
      published: data.published ?? true,
      createdAt: Date.now(),
      views: 0,
    };

    const ref = await db.collection("cards").add(doc);
    return jsonResponse(201, { id: ref.id, slug });
  } catch (err) {
    return jsonResponse(500, { error: (err as Error).message });
  }
};
