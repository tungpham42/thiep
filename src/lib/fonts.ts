export interface FontDef {
  name: string;
  css: string;
  url: string;
}

export const GOOGLE_FONTS: FontDef[] = [
  {
    name: "Playfair Display",
    css: "'Playfair Display', serif",
    url: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap",
  },
  {
    name: "Dancing Script",
    css: "'Dancing Script', cursive",
    url: "https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap",
  },
  {
    name: "Great Vibes",
    css: "'Great Vibes', cursive",
    url: "https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap",
  },
  {
    name: "Pacifico",
    css: "'Pacifico', cursive",
    url: "https://fonts.googleapis.com/css2?family=Pacifico&display=swap",
  },
  {
    name: "Lora",
    css: "'Lora', serif",
    url: "https://fonts.googleapis.com/css2?family=Lora:wght@400;700&display=swap",
  },
  {
    name: "Cormorant Garamond",
    css: "'Cormorant Garamond', serif",
    url: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;700&display=swap",
  },
  {
    name: "Be Vietnam Pro",
    css: "'Be Vietnam Pro', sans-serif",
    url: "https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;700&display=swap",
  },
];

export function getFontCss(name: string): string {
  return GOOGLE_FONTS.find((f) => f.name === name)?.css ?? "sans-serif";
}

export function loadGoogleFont(name: string) {
  const def = GOOGLE_FONTS.find((f) => f.name === name);
  if (!def) return;
  if (document.querySelector(`link[data-font="${name}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = def.url;
  link.setAttribute("data-font", name);
  document.head.appendChild(link);
}
