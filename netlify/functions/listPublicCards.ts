import { Handler } from "@netlify/functions";
import { db, jsonResponse } from "./_lib/firebaseAdmin";

export const handler: Handler = async () => {
  const snap = await db
    .collection("cards")
    .where("published", "==", true)
    .orderBy("createdAt", "desc")
    .limit(8)
    .get();

  const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return jsonResponse(200, items);
};
