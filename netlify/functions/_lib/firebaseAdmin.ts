import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

// Khởi tạo Firebase Admin nếu chưa có app nào
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export const db = getFirestore();
export const auth = getAuth();

export async function verifyToken(authHeader?: string) {
  if (!authHeader?.startsWith("Bearer ")) return null;
  try {
    return await auth.verifyIdToken(authHeader.slice(7));
  } catch {
    return null;
  }
}

export const jsonResponse = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});
