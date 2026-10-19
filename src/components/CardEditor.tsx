import { useState, FormEvent, useEffect } from "react";
import { Card, CardInput, AnimationType, DEFAULT_THEME } from "../types";
import { GOOGLE_FONTS, loadGoogleFont } from "../lib/fonts";
import { FLOWER_PRESETS } from "../lib/flowers";
import { FlowerSVG } from "./FlowerSVG";
import { api } from "../lib/api";

interface Props {
  initial?: Card;
  onSubmit: (data: CardInput) => Promise<void>;
  submitLabel: string;
}

const ANIMATIONS: { value: AnimationType; label: string }[] = [
  { value: "bloom", label: "Bloom" },
  { value: "sway", label: "Sway" },
  { value: "fall", label: "Fall" },
  { value: "float", label: "Float" },
  { value: "pulse", label: "Pulse" },
];

export function CardEditor({ initial, onSubmit, submitLabel }: Props) {
  const [data, setData] = useState<CardInput>(() =>
    initial
      ? {
          slug: initial.slug,
          recipientName: initial.recipientName,
          senderName: initial.senderName,
          message: initial.message,
          fontFamily: initial.fontFamily,
          flowerSvg: initial.flowerSvg,
          animation: initial.animation,
          theme: initial.theme,
          published: initial.published,
        }
      : {
          slug: "",
          recipientName: "",
          senderName: "",
          message: "",
          fontFamily: "Playfair Display",
          flowerSvg: FLOWER_PRESETS[0].svg,
          animation: "bloom",
          theme: DEFAULT_THEME,
          published: true,
        },
  );

  const [slugStatus, setSlugStatus] = useState<
    "idle" | "checking" | "ok" | "taken"
  >("idle");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadGoogleFont(data.fontFamily);
  }, [data.fontFamily]);

  const patch = (p: Partial<CardInput>) => setData((d) => ({ ...d, ...p }));

  const checkSlug = async () => {
    if (!data.slug.trim()) {
      setSlugStatus("idle");
      return;
    }
    if (initial && initial.slug === data.slug) {
      setSlugStatus("ok");
      return;
    }
    setSlugStatus("checking");
    const { available } = await api.checkSlug(data.slug);
    setSlugStatus(available ? "ok" : "taken");
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (slugStatus === "taken") {
      setError("Slug đã tồn tại.");
      return;
    }
    setSaving(true);
    try {
      await onSubmit(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="editor-split">
      <form onSubmit={submit} className="editor-form surface">
        <h2 className="editor-section-title">Nội dung</h2>

        <div className="editor-row">
          <div className="field">
            <label className="field-label">Người nhận *</label>
            <input
              className="input"
              value={data.recipientName}
              onChange={(e) => patch({ recipientName: e.target.value })}
              required
              placeholder="Mẹ yêu, chị Lan, …"
            />
          </div>
          <div className="field">
            <label className="field-label">Người gửi</label>
            <input
              className="input"
              value={data.senderName}
              onChange={(e) => patch({ senderName: e.target.value })}
              placeholder="Tên của bạn"
            />
          </div>
        </div>

        <div className="field">
          <label className="field-label">Slug (để trống để tự sinh)</label>
          <input
            className="input"
            value={data.slug}
            onChange={(e) => {
              patch({
                slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
              });
              setSlugStatus("idle");
            }}
            onBlur={checkSlug}
            placeholder="chuc-mung-sinh-nhat"
          />
          {slugStatus === "taken" && (
            <small className="slug-hint slug-hint--taken">
              ❌ Slug đã tồn tại
            </small>
          )}
          {slugStatus === "ok" && (
            <small className="slug-hint slug-hint--ok">
              ✅ Slug có thể dùng
            </small>
          )}
          {slugStatus === "checking" && (
            <small className="slug-hint slug-hint--checking">
              Đang kiểm tra…
            </small>
          )}
        </div>

        <div className="field">
          <label className="field-label">Lời chúc *</label>
          <textarea
            className="textarea"
            value={data.message}
            onChange={(e) => patch({ message: e.target.value })}
            required
            placeholder="Viết điều bạn muốn nói…"
          />
        </div>

        <h2 className="editor-section-title">Phong cách</h2>

        <div className="editor-row">
          <div className="field">
            <label className="field-label">Font chữ</label>
            <select
              className="select"
              value={data.fontFamily}
              onChange={(e) => patch({ fontFamily: e.target.value })}
            >
              {GOOGLE_FONTS.map((f) => (
                <option key={f.name} value={f.name}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="field-label">Hiệu ứng hoa</label>
            <select
              className="select"
              value={data.animation}
              onChange={(e) =>
                patch({ animation: e.target.value as AnimationType })
              }
            >
              {ANIMATIONS.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="field">
          <label className="field-label">Hoa</label>
          <div className="chip-row">
            {FLOWER_PRESETS.map((p) => (
              <button
                type="button"
                key={p.key}
                className={`chip ${data.flowerSvg === p.svg ? "chip--active" : ""}`}
                onClick={() => patch({ flowerSvg: p.svg })}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label className="field-label">Hoặc dán SVG tùy chỉnh</label>
          <textarea
            className="textarea"
            value={data.flowerSvg}
            onChange={(e) => patch({ flowerSvg: e.target.value })}
            style={{
              minHeight: 90,
              fontFamily: "ui-monospace, monospace",
              fontSize: 12,
            }}
          />
        </div>

        <h2 className="editor-section-title">Màu sắc</h2>
        <div className="color-row">
          {(
            [
              ["background", "Nền"],
              ["primary", "Chính"],
              ["accent", "Nhấn"],
              ["textColor", "Chữ"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="color-field">
              <label className="field-label">{label}</label>
              <label className="color-swatch">
                <input
                  type="color"
                  value={data.theme[key]}
                  onChange={(e) =>
                    patch({ theme: { ...data.theme, [key]: e.target.value } })
                  }
                />
                {data.theme[key]}
              </label>
            </div>
          ))}
        </div>

        <div className="field">
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={data.published}
              onChange={(e) => patch({ published: e.target.checked })}
              style={{ width: 18, height: 18, accentColor: "var(--rose-500)" }}
            />
            <span className="field-label" style={{ margin: 0 }}>
              Xuất bản (hiển thị công khai)
            </span>
          </label>
        </div>

        {error && <div className="editor-error">{error}</div>}

        <button className="btn btn-primary" disabled={saving} type="submit">
          {saving ? "Đang lưu…" : submitLabel}
        </button>
      </form>

      <aside className="editor-preview">
        <div className="editor-preview-label">Live preview</div>
        <div
          className="editor-preview-body"
          style={{
            background: `
              radial-gradient(circle at 20% 10%, ${data.theme.accent}25, transparent 50%),
              radial-gradient(circle at 80% 90%, ${data.theme.primary}22, transparent 55%),
              ${data.theme.background}
            `,
            color: data.theme.textColor,
          }}
        >
          <div className="editor-preview-flower">
            <FlowerSVG
              svg={data.flowerSvg}
              animation={data.animation}
              theme={data.theme}
            />
          </div>
          <h3
            className="editor-preview-name"
            style={{
              fontFamily: `'${data.fontFamily}', serif`,
              color: data.theme.textColor,
            }}
          >
            Gửi {data.recipientName || "…"}
          </h3>
          <p
            className="editor-preview-message"
            style={{ fontFamily: `'${data.fontFamily}', serif` }}
          >
            {data.message || "Lời chúc sẽ xuất hiện ở đây…"}
          </p>
          {data.senderName && (
            <p
              className="editor-preview-sig"
              style={{ color: data.theme.primary }}
            >
              — {data.senderName}
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
