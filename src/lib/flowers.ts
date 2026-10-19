export interface FlowerPreset {
  key: string;
  name: string;
  svg: string;
}

/**
 * Realistic flower illustrations.
 *
 * Theming:
 *  - Petals use `currentColor` (set the CSS `color` on the container).
 *  - Flower centres / stamens use `var(--accent, #fbbf24)`.
 *  - Leaves, stems and shading are fixed natural colours / black-white
 *    overlays so any petal colour still looks three-dimensional.
 *
 * All gradient / filter ids are prefixed per flower to avoid collisions
 * when several SVGs are inlined in the same page.
 */

const WRAP = (inner: string) =>
  `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" overflow="visible">${inner}</svg>`;

/** Deterministic pseudo-random in [0,1) so output is stable between renders. */
const rnd = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const n2 = (n: number) => Math.round(n * 100) / 100;

const SHADOW = (id: string, dy = 1.2, blur = 1.6, op = 0.35) =>
  `<filter id="${id}" x="-30%" y="-30%" width="160%" height="160%">
    <feDropShadow dx="0" dy="${dy}" stdDeviation="${blur}" flood-color="#000" flood-opacity="${op}"/>
  </filter>`;

const LEAF_GRAD = (id: string) =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#7bb94d"/>
    <stop offset=".55" stop-color="#418b36"/>
    <stop offset="1" stop-color="#1d5526"/>
  </linearGradient>`;

const ACCENT = `style="fill:var(--accent, #fbbf24)"`;

/* ------------------------------------------------------------------ */
/* ROSE – top-down view, five spiralling rings of cupped petals        */
/* ------------------------------------------------------------------ */
const ROSE_PETAL =
  "M0,0 C-32,-8 -46,-42 -30,-66 C-20,-78 -8,-72 0,-76 C8,-72 20,-78 30,-66 C46,-42 32,-8 0,0Z";

const rosePetal = (rot: number, s: number) => `
  <g transform="translate(100 100) rotate(${n2(rot)}) scale(${s})" filter="url(#rose-sh)">
    <path d="${ROSE_PETAL}" fill="currentColor"/>
    <path d="${ROSE_PETAL}" fill="url(#rose-lit)"/>
    <g fill="none" stroke="#000" stroke-opacity=".13" stroke-width=".9" stroke-linecap="round">
      <path d="M0,-6 C-6,-30 -8,-52 -3,-70"/>
      <path d="M0,-6 C6,-30 8,-52 3,-70"/>
      <path d="M-3,-8 C-18,-26 -26,-44 -24,-60"/>
      <path d="M3,-8 C18,-26 26,-44 24,-60"/>
    </g>
    <path d="M-28,-66 C-20,-77 -8,-72 0,-75 C8,-72 20,-77 28,-66" fill="none"
      stroke="#fff" stroke-opacity=".38" stroke-width="1.6" stroke-linecap="round"/>
  </g>`;

const roseLeaf = (rot: number) => `
  <g transform="translate(100 100) rotate(${rot})">
    <path d="M0,-30 C-26,-44 -28,-76 0,-98 C28,-76 26,-44 0,-30Z" fill="url(#rose-leaf)"/>
    <path d="M0,-32 L0,-94" stroke="#cfe8a8" stroke-opacity=".55" stroke-width="1.2" fill="none"/>
    <path d="M0,-50 L-12,-62 M0,-50 L12,-62 M0,-66 L-9,-76 M0,-66 L9,-76" stroke="#cfe8a8" stroke-opacity=".3" stroke-width=".8" fill="none"/>
  </g>`;

const rose = WRAP(`
  <defs>
    <linearGradient id="rose-lit" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity=".30"/>
      <stop offset=".45" stop-color="#fff" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity=".55"/>
    </linearGradient>
    <radialGradient id="rose-core" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#000" stop-opacity=".55"/>
      <stop offset="1" stop-color="#000" stop-opacity="0"/>
    </radialGradient>
    ${LEAF_GRAD("rose-leaf")}
    ${SHADOW("rose-sh", 1.4, 1.8, 0.4)}
  </defs>
  ${[38, 142, 222, 322].map(roseLeaf).join("")}
  ${Array.from({ length: 5 })
    .map((_, i) => rosePetal(i * 72 + rnd(i) * 8 - 4, 0.98))
    .join("")}
  ${Array.from({ length: 5 })
    .map((_, i) => rosePetal(36 + i * 72 + rnd(i + 9) * 8 - 4, 0.74))
    .join("")}
  <circle cx="100" cy="100" r="34" fill="url(#rose-core)"/>
  ${Array.from({ length: 5 })
    .map((_, i) => rosePetal(10 + i * 72 + rnd(i + 20) * 8 - 4, 0.52))
    .join("")}
  ${Array.from({ length: 4 })
    .map((_, i) => rosePetal(-20 + i * 90 + rnd(i + 40) * 10, 0.34))
    .join("")}
  <g transform="translate(100 100)">
    <circle r="9" fill="currentColor" filter="url(#rose-sh)"/>
    <circle r="9" fill="url(#rose-lit)"/>
    <path d="M0,0 C4,-1 5,-5 1,-6.5 C-4,-8 -8,-3 -6,2 C-4,7 3,8 7,4"
      fill="none" stroke="#000" stroke-opacity=".4" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M-1,-5 C-4,-5 -6,-2 -5,0" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="1"/>
  </g>`);

/* ------------------------------------------------------------------ */
/* DAISY – two layers of grooved ray petals, phyllotaxis disc          */
/* ------------------------------------------------------------------ */
const DAISY_PETAL =
  "M0,-12 C-6,-22 -9.5,-46 -6,-68 C-4.5,-75 -1.5,-76 0,-72 C1.5,-76 4.5,-75 6,-68 C9.5,-46 6,-22 0,-12Z";

const daisyPetal = (rot: number, s: number, back: boolean) => `
  <g transform="translate(100 100) rotate(${n2(rot)}) scale(${n2(s)})">
    <path d="${DAISY_PETAL}" fill="currentColor"/>
    <path d="${DAISY_PETAL}" fill="url(#daisy-lit)"/>
    ${back ? `<path d="${DAISY_PETAL}" fill="#000" opacity=".12"/>` : ""}
    <g fill="none" stroke-linecap="round">
      <path d="M0,-16 L0,-66" stroke="#000" stroke-opacity=".13" stroke-width=".9"/>
      <path d="M-3,-18 C-4.5,-40 -4.5,-55 -3.6,-65" stroke="#000" stroke-opacity=".09" stroke-width=".8"/>
      <path d="M3,-18 C4.5,-40 4.5,-55 3.6,-65" stroke="#000" stroke-opacity=".09" stroke-width=".8"/>
      <path d="M-1.4,-20 L-1.4,-64" stroke="#fff" stroke-opacity=".25" stroke-width=".6"/>
    </g>
  </g>`;

const daisyFlorets = Array.from({ length: 70 })
  .map((_, i) => {
    const a = (i * 137.508 * Math.PI) / 180;
    const r = 1.65 * Math.sqrt(i + 1);
    const x = n2(Math.cos(a) * r);
    const y = n2(Math.sin(a) * r);
    const size = n2(0.85 + (i / 70) * 0.35);
    return `<circle cx="${x}" cy="${y}" r="${size}" fill="#7a3f00" opacity=".45"/>
            <circle cx="${n2(x - 0.3)}" cy="${n2(y - 0.35)}" r="${n2(size * 0.55)}" fill="#fff" opacity=".4"/>`;
  })
  .join("");

const daisy = WRAP(`
  <defs>
    <linearGradient id="daisy-lit" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity=".28"/>
      <stop offset=".55" stop-color="#fff" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity=".38"/>
    </linearGradient>
    <radialGradient id="daisy-dome" cx="38%" cy="32%" r="75%">
      <stop offset="0" stop-color="#fff" stop-opacity=".45"/>
      <stop offset=".5" stop-color="#fff" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity=".5"/>
    </radialGradient>
    <radialGradient id="daisy-ring" cx="50%" cy="50%" r="50%">
      <stop offset=".55" stop-color="#000" stop-opacity=".45"/>
      <stop offset="1" stop-color="#000" stop-opacity="0"/>
    </radialGradient>
    ${SHADOW("daisy-sh", 1, 1.3, 0.3)}
  </defs>
  <g>
    ${Array.from({ length: 17 })
      .map((_, i) =>
        daisyPetal(
          i * (360 / 17) + 8 + rnd(i) * 8 - 4,
          0.92 + rnd(i + 3) * 0.1,
          true,
        ),
      )
      .join("")}
  </g>
  <g filter="url(#daisy-sh)">
    ${Array.from({ length: 15 })
      .map((_, i) =>
        daisyPetal(
          i * 24 + rnd(i + 30) * 8 - 4,
          1 + rnd(i + 50) * 0.08 - 0.04,
          false,
        ),
      )
      .join("")}
  </g>
  <circle cx="100" cy="100" r="22" fill="url(#daisy-ring)"/>
  <g transform="translate(100 100)">
    <circle r="15.5" ${ACCENT}/>
    ${daisyFlorets}
    <circle r="15.5" fill="url(#daisy-dome)"/>
    <circle r="15.5" fill="none" stroke="#000" stroke-opacity=".25" stroke-width=".8"/>
  </g>`);

/* ------------------------------------------------------------------ */
/* TULIP – side view, cupped petals with stem and long leaves          */
/* ------------------------------------------------------------------ */
const T_BACK =
  "M100,104 C78,96 74,52 84,30 C90,16 96,12 100,10 C104,12 110,16 116,30 C126,52 122,96 100,104Z";
const T_SIDE =
  "M100,108 C70,104 54,74 60,44 C63,30 70,20 80,22 C91,42 99,72 100,108Z";
const T_FRONT =
  "M100,112 C84,104 79,64 89,38 C93,28 97,23 100,21 C103,23 107,28 111,38 C121,64 116,104 100,112Z";

const tulipPetal = (d: string, extra = "", mirror = false) => `
  <g ${mirror ? `transform="translate(200 0) scale(-1 1)"` : ""} filter="url(#tulip-sh)">
    <path d="${d}" fill="currentColor"/>
    <path d="${d}" fill="url(#tulip-h)"/>
    <path d="${d}" fill="url(#tulip-v)"/>
    ${extra}
  </g>`;

const tulip = WRAP(`
  <defs>
    <linearGradient id="tulip-h" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#000" stop-opacity=".38"/>
      <stop offset=".32" stop-color="#fff" stop-opacity=".25"/>
      <stop offset=".55" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity=".4"/>
    </linearGradient>
    <linearGradient id="tulip-v" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity=".12"/>
      <stop offset=".7" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity=".28"/>
    </linearGradient>
    <linearGradient id="tulip-stem" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#2c6e2c"/>
      <stop offset=".45" stop-color="#7fbf55"/>
      <stop offset="1" stop-color="#2a6529"/>
    </linearGradient>
    ${LEAF_GRAD("tulip-leaf")}
    ${SHADOW("tulip-sh", 1, 1.6, 0.35)}
  </defs>

  <!-- leaves -->
  <g>
    <path d="M99,198 C70,186 46,150 52,98 C78,124 96,160 99,198Z" fill="url(#tulip-leaf)"/>
    <path d="M97,194 C80,160 66,130 56,106" fill="none" stroke="#d6efb0" stroke-opacity=".5" stroke-width="1.3"/>
    <path d="M101,198 C126,190 152,166 158,128 C130,138 104,164 101,198Z" fill="url(#tulip-leaf)"/>
    <path d="M103,194 C122,166 138,146 154,132" fill="none" stroke="#d6efb0" stroke-opacity=".5" stroke-width="1.3"/>
  </g>

  <!-- stem -->
  <path d="M100,108 C103,140 97,166 100,198" fill="none" stroke="url(#tulip-stem)" stroke-width="6" stroke-linecap="round"/>
  <path d="M98.4,112 C101,142 95.4,166 98.4,196" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="1.2" stroke-linecap="round"/>

  <!-- bloom -->
  <ellipse cx="100" cy="109" rx="7" ry="4.5" fill="#3c7f33"/>
  ${tulipPetal(T_BACK, `<path d="${T_BACK}" fill="#000" opacity=".18"/>`)}
  ${tulipPetal(
    T_SIDE,
    `<path d="M98,104 C92,80 82,54 76,30" fill="none" stroke="#000" stroke-opacity=".12" stroke-width=".9"/>
                        <path d="M94,102 C82,80 68,60 64,44" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".9"/>`,
  )}
  ${tulipPetal(
    T_SIDE,
    `<path d="M98,104 C92,80 82,54 76,30" fill="none" stroke="#000" stroke-opacity=".12" stroke-width=".9"/>
                        <path d="M94,102 C82,80 68,60 64,44" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".9"/>`,
    true,
  )}
  ${tulipPetal(
    T_FRONT,
    `<path d="M100,108 C98,80 98,50 100,28" fill="none" stroke="#000" stroke-opacity=".12" stroke-width=".9"/>
                         <path d="M96,106 C91,80 92,52 96,34" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".9"/>
                         <path d="M104,106 C109,80 108,52 104,34" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".9"/>
                         <path d="M97,30 C99,25 101,25 103,30" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="1.4" stroke-linecap="round"/>`,
  )}`);

/* ------------------------------------------------------------------ */
/* LOTUS – pointed petals in rows, seed pod, stamens, lily pad         */
/* ------------------------------------------------------------------ */
const LOTUS_PETAL = "M0,0 C-24,-22 -30,-64 0,-110 C30,-64 24,-22 0,0Z";

const lotusPetal = (rot: number, s: number, shade: number) => `
  <g transform="translate(100 156) rotate(${rot}) scale(${s})" filter="url(#lotus-sh)">
    <path d="${LOTUS_PETAL}" fill="currentColor"/>
    <path d="${LOTUS_PETAL}" fill="url(#lotus-lit)"/>
    ${shade > 0 ? `<path d="${LOTUS_PETAL}" fill="#000" opacity="${shade}"/>` : ""}
    <g fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".9" stroke-linecap="round">
      <path d="M0,-6 L0,-96"/>
      <path d="M-2,-8 C-10,-40 -14,-70 -6,-96"/>
      <path d="M2,-8 C10,-40 14,-70 6,-96"/>
      <path d="M-4,-10 C-18,-36 -24,-60 -16,-78"/>
      <path d="M4,-10 C18,-36 24,-60 16,-78"/>
    </g>
    <path d="M0,-108 C-5,-96 -6,-84 -4,-74" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.2" stroke-linecap="round"/>
  </g>`;

const lotusStamens = Array.from({ length: 28 })
  .map((_, i) => {
    const a = -62 + (i / 27) * 124 + (rnd(i) * 6 - 3);
    const len = 15 + rnd(i + 7) * 8;
    const rad = (a * Math.PI) / 180;
    const x = n2(100 + Math.sin(rad) * len);
    const y = n2(108 - Math.cos(rad) * len);
    return `<line x1="100" y1="108" x2="${x}" y2="${y}" stroke="#f1d04a" stroke-width="1.1" stroke-linecap="round"/>
            <ellipse cx="${x}" cy="${y}" rx="1.3" ry="2.4" transform="rotate(${n2(a)} ${x} ${y})" ${ACCENT}/>`;
  })
  .join("");

const lotus = WRAP(`
  <defs>
    <linearGradient id="lotus-lit" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="#fff" stop-opacity=".65"/>
      <stop offset=".5" stop-color="#fff" stop-opacity=".05"/>
      <stop offset="1" stop-color="#000" stop-opacity=".1"/>
    </linearGradient>
    <radialGradient id="lotus-pad" cx="50%" cy="40%" r="65%">
      <stop offset="0" stop-color="#5faa43"/>
      <stop offset=".7" stop-color="#2f7a33"/>
      <stop offset="1" stop-color="#1b4d25"/>
    </radialGradient>
    <linearGradient id="lotus-pod" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#8aa83a"/>
      <stop offset=".45" stop-color="#d4e07a"/>
      <stop offset="1" stop-color="#6f8d2c"/>
    </linearGradient>
    ${SHADOW("lotus-sh", 1.2, 1.6, 0.3)}
  </defs>

  <!-- water ripples + lily pad -->
  <ellipse cx="100" cy="172" rx="96" ry="22" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="1"/>
  <ellipse cx="100" cy="172" rx="86" ry="19" fill="#000" opacity=".12"/>
  <path d="M100,170 L158,158 A78,17 0 1 1 142,167 Z" fill="none"/>
  <ellipse cx="100" cy="168" rx="80" ry="17" fill="url(#lotus-pad)"/>
  <g stroke="#cfe8a8" stroke-opacity=".3" stroke-width=".9" fill="none">
    ${Array.from({ length: 12 })
      .map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return `<path d="M100,168 L${n2(100 + Math.cos(a) * 74)},${n2(168 + Math.sin(a) * 15.5)}"/>`;
      })
      .join("")}
  </g>

  <!-- petals -->
  ${[-34, -17, 0, 17, 34].map((r) => lotusPetal(r, 0.92, 0.26)).join("")}
  ${[-76, 76].map((r) => lotusPetal(r, 0.7, 0.1)).join("")}
  ${[-52, -26, 26, 52].map((r) => lotusPetal(r, 0.95, 0.12)).join("")}

  <!-- seed pod and stamens -->
  ${lotusStamens}
  <path d="M90,106 Q100,100 110,106 L107,120 Q100,124 93,120Z" fill="url(#lotus-pod)"/>
  <ellipse cx="100" cy="106" rx="10" ry="3.6" fill="#c9d85f"/>
  <g fill="#5b6f1f">
    <circle cx="96" cy="106" r="1"/><circle cx="100" cy="105" r="1"/><circle cx="104" cy="106" r="1"/>
    <circle cx="98" cy="107.4" r="1"/><circle cx="102" cy="107.4" r="1"/>
  </g>

  ${[-38, -13, 13, 38].map((r) => lotusPetal(r, 0.5, 0)).join("")}`);

/* ------------------------------------------------------------------ */
/* SAKURA – five notched petals, deeper pink core, fine stamens        */
/* ------------------------------------------------------------------ */
const SAKURA_PETAL =
  "M0,-6 C-14,-14 -30,-34 -26,-52 C-24,-60 -16,-66 -9,-62 L0,-53 L9,-62 C16,-66 24,-60 26,-52 C30,-34 14,-14 0,-6Z";

const sakuraPetal = (rot: number) => `
  <g transform="translate(100 100) rotate(${n2(rot)})" filter="url(#sakura-sh)">
    <path d="${SAKURA_PETAL}" fill="#fff"/>
    <path d="${SAKURA_PETAL}" fill="url(#sakura-g)"/>
    <g fill="none" stroke="#000" stroke-opacity=".12" stroke-width=".8" stroke-linecap="round">
      <path d="M0,-8 L0,-50"/>
      <path d="M-2,-9 C-8,-24 -14,-38 -17,-52"/>
      <path d="M2,-9 C8,-24 14,-38 17,-52"/>
      <path d="M-3,-10 C-14,-20 -22,-34 -24,-48"/>
      <path d="M3,-10 C14,-20 22,-34 24,-48"/>
    </g>
    <path d="M-9,-62 C-16,-66 -24,-60 -26,-52 C-28,-44 -26,-38 -22,-30" fill="none"
      stroke="#fff" stroke-opacity=".6" stroke-width="1.2" stroke-linecap="round"/>
  </g>`;

const sakuraStamens = Array.from({ length: 18 })
  .map((_, i) => {
    const a = i * 20 + rnd(i) * 10 - 5;
    const len = 15 + rnd(i + 11) * 11;
    const rad = (a * Math.PI) / 180;
    const x = n2(Math.sin(rad) * len);
    const y = n2(-Math.cos(rad) * len);
    const mx = n2(Math.sin(rad + 0.12) * len * 0.55);
    const my = n2(-Math.cos(rad + 0.12) * len * 0.55);
    return `<path d="M0,0 Q${mx},${my} ${x},${y}" fill="none" stroke="#fde4ec" stroke-width=".9" stroke-linecap="round"/>
            <circle cx="${x}" cy="${y}" r="1.7" ${ACCENT}/>
            <circle cx="${n2(x - 0.5)}" cy="${n2(y - 0.5)}" r=".6" fill="#fff" opacity=".7"/>`;
  })
  .join("");

const sakura = WRAP(`
  <defs>
    <linearGradient id="sakura-g" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="currentColor" stop-opacity="1"/>
      <stop offset=".6" stop-color="currentColor" stop-opacity=".62"/>
      <stop offset="1" stop-color="currentColor" stop-opacity=".38"/>
    </linearGradient>
    <radialGradient id="sakura-core" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#a40f45" stop-opacity=".8"/>
      <stop offset=".55" stop-color="#c2185b" stop-opacity=".3"/>
      <stop offset="1" stop-color="#c2185b" stop-opacity="0"/>
    </radialGradient>
    ${SHADOW("sakura-sh", 0.8, 1.1, 0.28)}
  </defs>
  ${Array.from({ length: 5 })
    .map((_, i) => sakuraPetal(i * 72 + rnd(i + 2) * 8 - 4))
    .join("")}
  <circle cx="100" cy="100" r="30" fill="url(#sakura-core)"/>
  <g transform="translate(100 100)">
    ${sakuraStamens}
    <circle r="3.4" fill="#cfe29a"/>
    <circle cx="-.8" cy="-.8" r="1.3" fill="#fff" opacity=".6"/>
    <path d="M0,0 L0.6,-12" stroke="#b7d37a" stroke-width="1.3" stroke-linecap="round"/>
    <circle cx="0.6" cy="-12.5" r="1.4" fill="#b7d37a"/>
  </g>`);

/* ------------------------------------------------------------------ */
/* ORCHID – phalaenopsis: 3 sepals, 2 broad petals, lip and column     */
/* ------------------------------------------------------------------ */
const ORCH_SEPAL = "M0,0 C-22,-18 -26,-60 0,-82 C26,-60 22,-18 0,0Z";
const ORCH_PETAL =
  "M0,0 C-40,-12 -54,-52 -28,-74 C-10,-86 10,-86 28,-74 C54,-52 40,-12 0,0Z";

const orchidPart = (
  d: string,
  rot: number,
  s: number,
  shade: number,
  veins: number,
) => `
  <g transform="translate(100 98) rotate(${rot}) scale(${s})" filter="url(#orchid-sh)">
    <path d="${d}" fill="currentColor"/>
    <path d="${d}" fill="url(#orchid-lit)"/>
    ${shade > 0 ? `<path d="${d}" fill="#000" opacity="${shade}"/>` : ""}
    <g fill="none" stroke="#000" stroke-opacity=".13" stroke-width=".8" stroke-linecap="round">
      ${Array.from({ length: veins })
        .map((_, i) => {
          const t = (i / (veins - 1)) * 2 - 1;
          return `<path d="M0,-4 C${n2(t * 16)},-30 ${n2(t * 26)},-52 ${n2(t * 18)},-72"/>`;
        })
        .join("")}
    </g>
    <path d="${d}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1"/>
  </g>`;

const orchid = WRAP(`
  <defs>
    <linearGradient id="orchid-lit" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="#000" stop-opacity=".3"/>
      <stop offset=".3" stop-color="#fff" stop-opacity=".1"/>
      <stop offset="1" stop-color="#fff" stop-opacity=".22"/>
    </linearGradient>
    <radialGradient id="orchid-lip" cx="50%" cy="30%" r="70%">
      <stop offset="0" stop-color="#fff" stop-opacity=".3"/>
      <stop offset="1" stop-color="#000" stop-opacity=".25"/>
    </radialGradient>
    <radialGradient id="orchid-core" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#000" stop-opacity=".45"/>
      <stop offset="1" stop-color="#000" stop-opacity="0"/>
    </radialGradient>
    ${SHADOW("orchid-sh", 1.2, 1.6, 0.35)}
  </defs>

  <!-- sepals -->
  ${orchidPart(ORCH_SEPAL, 0, 0.98, 0.04, 7)}
  ${orchidPart(ORCH_SEPAL, 138, 0.92, 0.06, 7)}
  ${orchidPart(ORCH_SEPAL, -138, 0.92, 0.06, 7)}

  <!-- broad side petals -->
  ${orchidPart(ORCH_PETAL, -80, 0.95, 0, 9)}
  ${orchidPart(ORCH_PETAL, 80, 0.95, 0, 9)}

  <circle cx="100" cy="98" r="26" fill="url(#orchid-core)"/>

  <!-- lip (labellum) -->
  <g transform="translate(100 100)" filter="url(#orchid-sh)">
    <path d="M-4,-2 C-18,-14 -30,-6 -22,8 C-17,15 -8,10 -4,3Z" fill="currentColor"/>
    <path d="M-4,-2 C-18,-14 -30,-6 -22,8 C-17,15 -8,10 -4,3Z" fill="#000" opacity=".3"/>
    <path d="M4,-2 C18,-14 30,-6 22,8 C17,15 8,10 4,3Z" fill="currentColor"/>
    <path d="M4,-2 C18,-14 30,-6 22,8 C17,15 8,10 4,3Z" fill="#000" opacity=".3"/>
    <path d="M0,0 C-13,2 -19,14 -13,26 C-9,34 -3,36 0,31 C3,36 9,34 13,26 C19,14 13,2 0,0Z" fill="currentColor"/>
    <path d="M0,0 C-13,2 -19,14 -13,26 C-9,34 -3,36 0,31 C3,36 9,34 13,26 C19,14 13,2 0,0Z" fill="#000" opacity=".22"/>
    <path d="M0,0 C-13,2 -19,14 -13,26 C-9,34 -3,36 0,31 C3,36 9,34 13,26 C19,14 13,2 0,0Z" fill="url(#orchid-lip)"/>
    <g fill="none" stroke-linecap="round" style="stroke:var(--accent, #fbbf24)" stroke-opacity=".85" stroke-width="1.2">
      <path d="M0,4 L0,24"/><path d="M-4,5 L-7,20"/><path d="M4,5 L7,20"/>
    </g>
    <path d="M-3,31 C-8,40 -3,47 -10,51" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M3,31 C8,40 3,47 10,51" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M-9,10 C-7,22 -4,28 0,30" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1"/>
  </g>

  <!-- column and anther cap -->
  <g transform="translate(100 96)">
    <ellipse rx="5.5" ry="8" fill="#fbf4e2"/>
    <ellipse rx="5.5" ry="8" fill="url(#orchid-lip)"/>
    <circle cy="-4" r="2.8" ${ACCENT}/>
    <circle cx="-.8" cy="-4.8" r=".9" fill="#fff" opacity=".7"/>
  </g>`);

export const FLOWER_PRESETS: FlowerPreset[] = [
  { key: "rose", name: "Hoa hồng", svg: rose },
  { key: "daisy", name: "Hoa cúc", svg: daisy },
  { key: "tulip", name: "Hoa tulip", svg: tulip },
  { key: "lotus", name: "Hoa sen", svg: lotus },
  { key: "sakura", name: "Hoa anh đào", svg: sakura },
  { key: "orchid", name: "Hoa lan", svg: orchid },
];
