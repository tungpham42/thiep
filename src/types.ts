export type AnimationType = "bloom" | "sway" | "fall" | "float" | "pulse";

export interface CardTheme {
  background: string;
  primary: string;
  accent: string;
  textColor: string;
}

export interface Card {
  id: string;
  slug: string;
  recipientName: string;
  senderName: string;
  message: string;
  fontFamily: string;
  flowerSvg: string;
  animation: AnimationType;
  theme: CardTheme;
  createdAt: number;
  views: number;
  published: boolean;
}

export type CardInput = Omit<Card, "id" | "createdAt" | "views">;

export const DEFAULT_THEME: CardTheme = {
  background: "#fff5f7",
  primary: "#e11d48",
  accent: "#fbbf24",
  textColor: "#831843",
};
