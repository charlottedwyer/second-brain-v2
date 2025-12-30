type ThemeMode = "light" | "dark";
type ThemePalette = "lavender" | "forest" | "noir";

type SettingsProps = {
  mode: ThemeMode;
  palette: ThemePalette;
  setMode: (m: ThemeMode) => void;
  setPalette: (p: ThemePalette) => void;
};

export default function Settings({
  mode,
  palette,
  setMode,
  setPalette,
}: SettingsProps) {
  return (
    <div
      style={{
        padding: 24,
        maxWidth: 720,
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 32 }}>
        Settings
      </h1>

      {/* ================= ACCOUNT ================= */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 18, marginBottom: 12 }}>
          Account
        </h2>

        <div className="card">
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                fontSize: 13,
                opacity: 0.7,
                display: "block",
                marginBottom: 4,
              }}
            >
              Display name
            </label>
            <input
              type="text"
              placeholder="Your name"
              disabled
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                fontSize: 13,
                opacity: 0.7,
                display: "block",
                marginBottom: 4,
              }}
            >
              Email
            </label>
            <input
              type="email"
              placeholder="email@example.com"
              disabled
            />
          </div>

          <p
            style={{
              fontSize: 13,
              opacity: 0.6,
              margin: 0,
            }}
          >
            Account details will be editable once authentication
            is enabled.
          </p>
        </div>
      </section>

      {/* ================= APPEARANCE ================= */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 18, marginBottom: 12 }}>
          Appearance
        </h2>

        <div className="card">
          {/* MODE */}
          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                fontSize: 13,
                opacity: 0.7,
                display: "block",
                marginBottom: 6,
              }}
            >
              Mode
            </label>
            <div style={{ display: "flex", gap: 10 }}>
              <ModeButton
                active={mode === "light"}
                onClick={() => setMode("light")}
              >
                Light
              </ModeButton>
              <ModeButton
                active={mode === "dark"}
                onClick={() => setMode("dark")}
              >
                Dark
              </ModeButton>
            </div>
          </div>

          {/* PALETTE */}
          <div>
            <label
              style={{
                fontSize: 13,
                opacity: 0.7,
                display: "block",
                marginBottom: 6,
              }}
            >
              Colour palette
            </label>
            <div style={{ display: "flex", gap: 12 }}>
              <PaletteButton
                label="Lavender"
                active={palette === "lavender"}
                onClick={() => setPalette("lavender")}
              />
              <PaletteButton
                label="Forest"
                active={palette === "forest"}
                onClick={() => setPalette("forest")}
              />
              <PaletteButton
                label="Noir"
                active={palette === "noir"}
                onClick={() => setPalette("noir")}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= DANGER ================= */}
      <section>
        <h2
          style={{
            fontSize: 18,
            marginBottom: 12,
            color: "var(--muted)",
          }}
        >
          Advanced
        </h2>

        <div className="card">
          <button
            className="secondary"
            disabled
            style={{ width: "100%" }}
          >
            Sign out
          </button>

          <p
            style={{
              fontSize: 13,
              opacity: 0.6,
              marginTop: 12,
            }}
          >
            Sign-out and account actions will be available once
            authentication is connected.
          </p>
        </div>
      </section>
    </div>
  );
}

/* ================= UI ================= */

function ModeButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 14px",
        borderRadius: 999,
        border: active
          ? "2px solid var(--accent)"
          : "1px solid var(--border)",
        background: active
          ? "var(--accent-soft)"
          : "transparent",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function PaletteButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 14px",
        borderRadius: 12,
        border: active
          ? "2px solid var(--accent)"
          : "1px solid var(--border)",
        background: active
          ? "var(--accent-soft)"
          : "transparent",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}
