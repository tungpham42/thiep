import { auth } from "../firebase";
import { Card, CardInput } from "../types";

async function authedFetch(url: string, init: RequestInit = {}) {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Chưa đăng nhập");
  const headers: HeadersInit = {
    ...(init.headers || {}),
    Authorization: `Bearer ${token}`,
  };
  if (init.body) (headers as any)["Content-Type"] = "application/json";
  const res = await fetch(url, { ...init, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Lỗi không xác định" }));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

export const api = {
  listCards: (): Promise<Card[]> => authedFetch("/api/listCards"),
  createCard: (data: CardInput): Promise<{ id: string; slug: string }> =>
    authedFetch("/api/createCard", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateCard: (id: string, data: Partial<CardInput>) =>
    authedFetch(`/api/updateCard?id=${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteCard: (id: string) =>
    authedFetch(`/api/deleteCard?id=${id}`, { method: "DELETE" }),
  checkSlug: async (slug: string): Promise<{ available: boolean }> => {
    const res = await fetch(`/api/checkSlug?slug=${encodeURIComponent(slug)}`);
    return res.json();
  },
  listPublicCards: async (): Promise<Card[]> => {
    const res = await fetch("/api/listPublicCards");
    return res.json();
  },
};
