import { FormEvent, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { FlowerSVG } from "../components/FlowerSVG";
import { FLOWER_PRESETS } from "../lib/flowers";

const DEMO_THEME = {
  background: "#fff5f7",
  primary: "#e85a71",
  accent: "#f5a524",
  textColor: "#2d1810",
};

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      nav("/admin");
    } catch {
      setError("Email hoặc mật khẩu chưa đúng.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <aside className="auth-art">
        <div className="auth-art-inner stagger">
          <div className="auth-art-flower">
            <FlowerSVG
              svg={FLOWER_PRESETS[0].svg}
              animation="sway"
              theme={DEMO_THEME}
            />
          </div>
          <h2 className="auth-art-title">
            Chào mừng <br />
            <em>trở lại.</em>
          </h2>
          <p className="auth-art-sub">nơi những lời chúc được cất lên</p>
        </div>
      </aside>

      <main className="auth-form-wrap">
        <form className="auth-form stagger" onSubmit={submit}>
          <div>
            <span className="eyebrow">quản trị viên</span>
            <h1>Đăng nhập</h1>
            <p className="auth-form-sub">
              Tiếp tục quản lý những tấm thiệp của bạn.
            </p>
          </div>

          <div className="field">
            <label className="field-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="password">
              Mật khẩu
            </label>
            <input
              id="password"
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button className="btn btn-primary" type="submit" disabled={busy}>
            {busy ? "Đang đăng nhập…" : "Đăng nhập"}
          </button>

          <div className="auth-back muted">
            <Link to="/">← Về trang chủ</Link>
          </div>
        </form>
      </main>
    </div>
  );
}
