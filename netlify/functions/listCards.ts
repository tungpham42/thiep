import { Handler } from "@netlify/functions";
import { db, verifyToken, jsonResponse } from "./_lib/firebaseAdmin";

export const handler: Handler = async (event) => {
  const user = await verifyToken(event.headers.authorization);
  if (!user) return jsonResponse(401, { error: "Unauthorized" });

  const snap = await db.collection("cards").orderBy("createdAt", "desc").get();
  const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return jsonResponse(200, items);
};
