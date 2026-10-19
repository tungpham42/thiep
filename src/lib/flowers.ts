export interface FlowerPreset {
  key: string;
  name: string;
  svg: string;
}

const WRAP = (inner: string) =>
  `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">${inner}</svg>`;

export const FLOWER_PRESETS: FlowerPreset[] = [
  {
    key: "rose",
    name: "Hoa hồng",
    svg: WRAP(`
      <g transform="translate(100 100)">
        <g fill="currentColor" stroke="currentColor" stroke-width="1">
          <path d="M0,-60 C25,-60 45,-40 45,-15 C45,10 25,25 0,25 C-25,25 -45,10 -45,-15 C-45,-40 -25,-60 0,-60 Z" opacity=".35"/>
          <path d="M0,-45 C18,-45 32,-30 32,-10 C32,10 18,20 0,20 C-18,20 -32,10 -32,-10 C-32,-30 -18,-45 0,-45 Z" opacity=".55"/>
          <path d="M0,-30 C12,-30 20,-20 20,-5 C20,8 12,15 0,15 C-12,15 -20,8 -20,-5 C-20,-20 -12,-30 0,-30 Z" opacity=".8"/>
          <circle r="8" fill="var(--accent, #fbbf24)"/>
        </g>
      </g>`),
  },
  {
    key: "daisy",
    name: "Hoa cúc",
    svg: WRAP(`
      <g transform="translate(100 100)" fill="currentColor">
        ${Array.from({ length: 12 })
          .map(
            (_, i) =>
              `<ellipse cx="0" cy="-45" rx="10" ry="32" transform="rotate(${i * 30})" opacity="0.85"/>`,
          )
          .join("")}
        <circle r="16" fill="var(--accent, #fbbf24)"/>
      </g>`),
  },
  {
    key: "tulip",
    name: "Hoa tulip",
    svg: WRAP(`
      <g transform="translate(100 110)" fill="currentColor">
        <path d="M-30,-40 C-30,-75 -10,-90 0,-55 C10,-90 30,-75 30,-40 C30,-10 15,20 0,20 C-15,20 -30,-10 -30,-40 Z"/>
      </g>
      <path d="M100 130 L100 190" stroke="currentColor" stroke-width="4" opacity=".6"/>
      <path d="M100 160 Q80 155 70 145" stroke="currentColor" stroke-width="3" fill="none" opacity=".6"/>
      <path d="M100 165 Q120 160 130 150" stroke="currentColor" stroke-width="3" fill="none" opacity=".6"/>`),
  },
  {
    key: "lotus",
    name: "Hoa sen",
    svg: WRAP(`
      <g transform="translate(100 110)" fill="currentColor">
        <path d="M0,-70 C-20,-50 -20,-20 0,0 C20,-20 20,-50 0,-70 Z" opacity=".9"/>
        <path d="M-45,-50 C-55,-25 -35,-5 0,0 C-10,-25 -30,-45 -45,-50 Z" opacity=".75"/>
        <path d="M45,-50 C55,-25 35,-5 0,0 C10,-25 30,-45 45,-50 Z" opacity=".75"/>
        <path d="M-60,-10 C-50,5 -25,15 0,0 C-25,-5 -45,-5 -60,-10 Z" opacity=".6"/>
        <path d="M60,-10 C50,5 25,15 0,0 C25,-5 45,-5 60,-10 Z" opacity=".6"/>
        <circle cy="5" r="6" fill="var(--accent, #fbbf24)"/>
      </g>`),
  },
  {
    key: "sakura",
    name: "Hoa anh đào",
    svg: WRAP(`
      <g transform="translate(100 100)" fill="currentColor">
        ${Array.from({ length: 5 })
          .map(
            (_, i) => `
          <path transform="rotate(${i * 72})"
            d="M0,-15 C8,-30 8,-50 0,-55 C-8,-50 -8,-30 0,-15 Z" opacity="0.85"/>
        `,
          )
          .join("")}
        <circle r="8" fill="var(--accent, #fbbf24)"/>
        ${Array.from({ length: 8 })
          .map(
            (_, i) => `
          <line x1="0" y1="0" x2="0" y2="-8"
            transform="rotate(${i * 45})"
            stroke="var(--accent, #fbbf24)" stroke-width="1.2" opacity="0.8"/>
        `,
          )
          .join("")}
      </g>`),
  },
];
