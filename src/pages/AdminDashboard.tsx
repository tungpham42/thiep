import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { Card } from "../types";
import { api } from "../lib/api";
import { FlowerSVG } from "../components/FlowerSVG";

export function AdminDashboard() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  const refresh = async () => {
    setLoading(true);
    try {
      setCards(await api.listCards());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const remove = async (id: string, name: string) => {
    if (!window.confirm(`Xóa thiệp gửi "${name}"?`)) return;
    await api.deleteCard(id);
    refresh();
  };

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(url);
    // Tiny inline toast (fallback alert)
    const el = document.createElement("div");
    el.textContent = "✓ Đã copy link";
    Object.assign(el.style, {
      position: "fixed",
      bottom: "24px",
      left: "50%",
      transform: "translateX(-50%)",
      background: "#2d1810",
      color: "#fdf6f0",
      padding: "10px 20px",
      borderRadius: "999px",
      fontSize: "0.9rem",
      fontWeight: "600",
      zIndex: 10000,
      boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
    });
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1800);
  };

  return (
    <div className="dash">
      <div className="mesh" />

      <header className="dash-head">
        <div>
          <span className="eyebrow">quản trị</span>
          <h1 className="dash-title">Bộ sưu tập thiệp</h1>
          <p className="dash-sub">
            {cards.length > 0
              ? `${cards.length} thiệp trong bộ sưu tập của bạn`
              : "Chưa có thiệp nào — hãy tạo chiếc đầu tiên."}
          </p>
        </div>
        <div className="dash-actions">
          <Link to="/admin/new" className="btn btn-primary">
            + Tạo thiệp
          </Link>
          <button className="btn btn-ghost" onClick={() => signOut(auth)}>
            Đăng xuất
          </button>
        </div>
      </header>

      {loading ? (
        <div className="dash-empty">Đang tải…</div>
      ) : cards.length === 0 ? (
        <div className="dash-empty">
          <div className="dash-empty-icon">🌷</div>
          <h2 style={{ margin: "0 0 8px" }}>Chưa có thiệp nào</h2>
          <p style={{ margin: "0 0 20px" }}>
            Tạo tấm thiệp đầu tiên để bắt đầu chia sẻ.
          </p>
          <Link to="/admin/new" className="btn btn-primary">
            ✿ Tạo thiệp đầu tiên
          </Link>
        </div>
      ) : (
        <div className="dash-grid stagger">
          {cards.map((card) => (
            <article key={card.id} className="dash-card">
              <div
                className="dash-card-preview"
                style={{
                  background: `
                    radial-gradient(circle at 50% 120%, ${card.theme.accent}30, transparent 60%),
                    ${card.theme.background}
                  `,
                }}
              >
                <div className="dash-card-flower">
                  <FlowerSVG
                    svg={card.flowerSvg}
                    animation={card.animation}
                    theme={card.theme}
                  />
                </div>
              </div>

              <div className="dash-card-body">
                <h3 className="dash-card-name">Gửi {card.recipientName}</h3>
                <div className="dash-card-slug">{card.slug}</div>
                <div className="dash-card-meta">
                  <span>
                    👁 <strong>{card.views || 0}</strong>
                  </span>
                  <span
                    className={`dash-status ${
                      card.published
                        ? "dash-status--live"
                        : "dash-status--draft"
                    }`}
                  >
                    {card.published ? "Đang gửi" : "Nháp"}
                  </span>
                </div>
              </div>

              <div className="dash-card-actions">
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => nav(`/admin/edit/${card.id}`)}
                >
                  Sửa
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => copyLink(card.slug)}
                >
                  Copy
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => remove(card.id, card.recipientName)}
                >
                  Xóa
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
