import { useMemo } from "react";

interface PetalSpec {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  rotate: number;
  color: string;
}

const PETAL_COLORS = ["#f7a9b7", "#fbc9d1", "#fbd1a0", "#f7b8a3", "#fde4d1"];

export function PetalRain({
  count = 16,
  opacity = 0.55,
}: {
  count?: number;
  opacity?: number;
}) {
  const petals = useMemo<PetalSpec[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 14,
        duration: 12 + Math.random() * 12,
        size: 10 + Math.random() * 16,
        rotate: Math.random() * 360,
        color: PETAL_COLORS[i % PETAL_COLORS.length],
      })),
    [count],
  );

  return (
    <div className="petal-rain" aria-hidden style={{ opacity }}>
      {petals.map((p) => (
        <span
          key={p.id}
          className="petal"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            color: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            ["--rot" as any]: `${p.rotate}deg`,
          }}
        >
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 1.5 C 16.5 5 19.5 12.5 10 19 C 0.5 12.5 3.5 5 10 1.5 Z" />
          </svg>
        </span>
      ))}
    </div>
  );
}
