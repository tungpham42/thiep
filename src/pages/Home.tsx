import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FlowerSVG } from "../components/FlowerSVG";
import { FLOWER_PRESETS } from "../lib/flowers";
import { api } from "../lib/api";
import { Card, CardTheme } from "../types";

const DEFAULT_THEME: CardTheme = {
  background: "#fff5f7",
  primary: "#e11d48",
  accent: "#fbbf24",
  textColor: "#831843",
};

export function Home() {
  const [recent, setRecent] = useState<Card[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api.listPublicCards().then((cards) => {
      setRecent(cards);
      setLoaded(true);
    });
  }, []);

  return (
    <div className="home">
      <div className="mesh" />

      <div className="home-hero">
        <div className="home-floaters" aria-hidden>
          <div
            className="home-floater home-floater--1"
            style={{ color: "#e85a71" }}
          >
            <FlowerSVG
              svg={FLOWER_PRESETS[0].svg}
              animation="float"
              theme={DEFAULT_THEME}
            />
          </div>
          <div
            className="home-floater home-floater--2"
            style={{ color: "#f5a524" }}
          >
            <FlowerSVG
              svg={FLOWER_PRESETS[2].svg}
              animation="sway"
              theme={DEFAULT_THEME}
            />
          </div>
          <div
            className="home-floater home-floater--3"
            style={{ color: "#ec6b83" }}
          >
            <FlowerSVG
              svg={FLOWER_PRESETS[4].svg}
              animation="float"
              theme={DEFAULT_THEME}
            />
          </div>
          <div
            className="home-floater home-floater--4"
            style={{ color: "#d13e58" }}
          >
            <FlowerSVG
              svg={FLOWER_PRESETS[3].svg}
              animation="sway"
              theme={DEFAULT_THEME}
            />
          </div>
        </div>

        <div className="stagger">
          <span className="home-eyebrow">gửi yêu thương qua từng cánh hoa</span>
          <h1 className="home-title">
            Một tấm thiệp, <br />
            <em>ngàn lời chưa nói.</em>
          </h1>
          <p className="home-sub">
            Tạo thiệp chúc với hoa động, lời chúc viết tay và một đường link
            riêng — để gửi đi trong vài giây, nhưng đọng lại rất lâu.
          </p>
          <div className="home-cta">
            <Link to="/admin/new" className="btn btn-primary">
              ✿ Tạo thiệp ngay
            </Link>
            <Link to="/admin" className="btn btn-ghost">
              Vào quản trị
            </Link>
          </div>
        </div>
      </div>

      {loaded && recent.length > 0 && (
        <section className="home-recent">
          <div className="home-recent-head">
            <h2>Thiệp mới được gửi</h2>
            <span className="muted" style={{ fontSize: "0.9rem" }}>
              {recent.length} thiệp
            </span>
          </div>
          <div className="home-grid stagger">
            {recent.map((card) => (
              <Link key={card.id} to={`/${card.slug}`} className="home-card">
                <div className="home-card-flower">
                  <FlowerSVG
                    svg={card.flowerSvg}
                    animation={card.animation}
                    theme={card.theme}
                  />
                </div>
                <div className="home-card-name">Gửi {card.recipientName}</div>
                <div className="home-card-meta">{card.slug}</div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
