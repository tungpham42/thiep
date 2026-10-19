import { Handler } from "@netlify/functions";
import { db, verifyToken, jsonResponse } from "./_lib/firebaseAdmin";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "DELETE") return jsonResponse(405, {});
  const user = await verifyToken(event.headers.authorization);
  if (!user) return jsonResponse(401, { error: "Unauthorized" });

  const id = event.queryStringParameters?.id;
  if (!id) return jsonResponse(400, { error: "Thiếu id" });

  await db.collection("cards").doc(id).delete();
  return jsonResponse(200, { ok: true });
};
