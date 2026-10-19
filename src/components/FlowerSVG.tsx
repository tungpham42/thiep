import DOMPurify from "dompurify";
import { AnimationType, CardTheme } from "../types";

interface Props {
  svg: string;
  animation: AnimationType;
  theme: CardTheme;
  className?: string;
}

export function FlowerSVG({ svg, animation, theme, className }: Props) {
  const safe = DOMPurify.sanitize(svg, {
    USE_PROFILES: { svg: true, svgFilters: true },
    ADD_TAGS: [
      "svg",
      "g",
      "path",
      "circle",
      "ellipse",
      "line",
      "rect",
      "polygon",
    ],
  });

  return (
    <div
      className={`anim-wrap anim-${animation} ${className || ""}`}
      style={{
        width: "100%",
        height: "100%",
        color: theme.primary,
        ["--accent" as any]: theme.accent,
      }}
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
