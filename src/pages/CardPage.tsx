import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card } from "../types";
import { FlowerSVG } from "../components/FlowerSVG";
import { PetalRain } from "../components/PetalRain";
import { getFontCss, loadGoogleFont } from "../lib/fonts";

export function CardPage() {
  const { slug } = useParams();
  const [card, setCard] = useState<Card | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/getCard?slug=${encodeURIComponent(slug)}`)
      .then(async (r) => {
        if (!r.ok) throw new Error("Không tìm thấy thiệp");
        return r.json();
      })
      .then(setCard)
      .catch((e) => setError(e.message));
  }, [slug]);

  useEffect(() => {
    if (!card) return;
    document.title = `Gửi ${card.recipientName} 💌`;
    loadGoogleFont(card.fontFamily);
  }, [card]);

  if (error) {
    return (
      <div className="card-page" style={{ background: "var(--cream)" }}>
        <div className="mesh" />
        <div className="card-stage">
          <div className="card-frame">
            <div className="card-box">
              <h1 style={{ fontFamily: "'Fraunces', serif" }}>🌾 {error}</h1>
              <p className="muted">
                Có thể đường dẫn đã đổi hoặc thiệp chưa được xuất bản.
              </p>
              <Link to="/" className="btn btn-primary">
                Về trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="card-page" style={{ background: "var(--cream)" }}>
        <div className="mesh" />
        <div className="muted" style={{ fontSize: "1.1rem" }}>
          Đang mở thiệp…
        </div>
      </div>
    );
  }

  const font = getFontCss(card.fontFamily);

  return (
    <div
      className="card-page"
      style={{
        background: `
          radial-gradient(circle at 15% 8%, ${card.theme.accent}20, transparent 45%),
          radial-gradient(circle at 85% 90%, ${card.theme.primary}22, transparent 50%),
          ${card.theme.background}
        `,
      }}
    >
      <PetalRain count={14} opacity={0.4} />

      <div className="card-stage">
        <div className="card-frame">
          <div
            className="card-box card-reveal"
            style={{
              ["--theme-primary" as any]: card.theme.primary,
              ["--theme-accent" as any]: card.theme.accent,
              ["--theme-text" as any]: card.theme.textColor,
            }}
          >
            <div className="card-flower">
              <FlowerSVG
                svg={card.flowerSvg}
                animation={card.animation}
                theme={card.theme}
              />
            </div>

            <p
              className="card-eyebrow"
              style={{ fontFamily: "'Mali', cursive" }}
            >
              thân gửi
            </p>

            <h1 className="card-recipient" style={{ fontFamily: font }}>
              {card.recipientName}
            </h1>

            <p className="card-message" style={{ fontFamily: font }}>
              {card.message}
            </p>

            {card.senderName && (
              <p
                className="card-signature"
                style={{ fontFamily: "'Mali', cursive" }}
              >
                — {card.senderName}
              </p>
            )}

            <div className="card-footer-note">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21s-8-5.5-8-11a5 5 0 0 1 8-4 5 5 0 0 1 8 4c0 5.5-8 11-8 11z" />
              </svg>
              Thiệp Hoa Online
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
