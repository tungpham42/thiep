import { useEffect } from "react";
import { Card } from "../types";
import { FlowerSVG } from "./FlowerSVG";
import { getFontCss, loadGoogleFont } from "../lib/fonts";

export function CardDisplay({ card }: { card: Card }) {
  useEffect(() => {
    loadGoogleFont(card.fontFamily);
  }, [card.fontFamily]);

  const font = getFontCss(card.fontFamily);

  return (
    <div className="card-page" style={{ background: card.theme.background }}>
      <div className="card-box" style={{ color: card.theme.textColor }}>
        <div className="card-flower">
          <FlowerSVG
            svg={card.flowerSvg}
            animation={card.animation}
            theme={card.theme}
          />
        </div>

        <h1 style={{ fontFamily: font, margin: "8px 0" }}>
          Gửi {card.recipientName} 💌
        </h1>

        <p className="card-message" style={{ fontFamily: font }}>
          {card.message}
        </p>

        {card.senderName && (
          <p className="card-signature" style={{ fontFamily: font }}>
            — {card.senderName}
          </p>
        )}
      </div>
    </div>
  );
}
