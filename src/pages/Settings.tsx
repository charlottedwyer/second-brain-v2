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
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>
        Settings
      </h1>

      {/* APPEARANCE */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 18, marginBottom: 12 }}>
          Appearance
        </h2>

        {/* MODE */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontWeight: "bold" }}>
            Mode
          </label>
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
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
          <label style={{ fontWeight: "bold" }}>
            Colour palette
          </label>
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
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
      </section>

      {/* FUTURE */}
      <section style={{ opacity: 0.6 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>
          More settings
        </h2>
        <p>Coming soon.</p>
      </section>
    </div>
  );
}

/* ---------------- UI ---------------- */

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
        border: active ? "2px solid #7c6cff" : "1px solid #ccc",
        background: active
          ? "rgba(160,120,255,0.15)"
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
        border: active ? "2px solid #7c6cff" : "1px solid #ccc",
        background: active
          ? "rgba(160,120,255,0.15)"
          : "transparent",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}
