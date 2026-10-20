import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CardEditor } from "../components/CardEditor";
import { api } from "../lib/api";
import { Card } from "../types";

function EditorShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="editor">
      <div className="mesh" />
      <header className="editor-head">
        <Link to="/admin" className="btn-back">
          ← Quay lại bộ sưu tập
        </Link>
        <h1>{title}</h1>
        <div style={{ width: 160 }} />
      </header>
      {children}
    </div>
  );
}

export function AdminNewCard() {
  const nav = useNavigate();
  return (
    <EditorShell title="Tạo thiệp mới">
      <CardEditor
        submitLabel="✿ Tạo thiệp"
        onSubmit={async (data) => {
          const res = await api.createCard(data);
          nav(`/${res.slug}`);
        }}
      />
    </EditorShell>
  );
}

export function AdminEditCard() {
  const { id } = useParams();
  const nav = useNavigate();
  const [card, setCard] = useState<Card | null>(null);

  useEffect(() => {
    api.listCards().then((all) => {
      const found = all.find((c) => c.id === id);
      if (found) setCard(found);
    });
  }, [id]);

  if (!card) {
    return (
      <EditorShell title="Sửa thiệp">
        <div className="dash-empty">Đang tải…</div>
      </EditorShell>
    );
  }

  return (
    <EditorShell title="Sửa thiệp">
      <CardEditor
        initial={card}
        submitLabel="Lưu thay đổi"
        onSubmit={async (data) => {
          await api.updateCard(card.id, data);
          nav("/admin");
        }}
      />
    </EditorShell>
  );
}
