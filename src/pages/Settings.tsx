type SettingsProps = {
  theme: "light" | "dark";
  setTheme: (t: string) => void;
};

export default function Settings({ theme, setTheme }: SettingsProps) {
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

      {/* THEME */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>
          Appearance
        </h2>

        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
          }}
        >
          <label style={{ fontWeight: "bold" }}>
            Theme
          </label>

          <button
            onClick={() => setTheme("light")}
            style={{
              padding: "6px 14px",
              borderRadius: 999,
              border:
                theme === "light"
                  ? "2px solid #7c6cff"
                  : "1px solid #ccc",
              background:
                theme === "light"
                  ? "rgba(160,120,255,0.15)"
                  : "transparent",
              cursor: "pointer",
            }}
          >
            Light
          </button>

          <button
            onClick={() => setTheme("dark")}
            style={{
              padding: "6px 14px",
              borderRadius: 999,
              border:
                theme === "dark"
                  ? "2px solid #7c6cff"
                  : "1px solid #ccc",
              background:
                theme === "dark"
                  ? "rgba(160,120,255,0.15)"
                  : "transparent",
              cursor: "pointer",
            }}
          >
            Dark
          </button>
        </div>
      </section>

      {/* PLACEHOLDERS FOR FUTURE */}
      <section style={{ marginBottom: 32, opacity: 0.7 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>
          Account
        </h2>
        <p>Coming soon.</p>
      </section>

      <section style={{ marginBottom: 32, opacity: 0.7 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>
          Data & Export
        </h2>
        <p>Coming soon.</p>
      </section>

      <section style={{ opacity: 0.7 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>
          About
        </h2>
        <p>
          Second Brain is your personal system for thinking,
          remembering, and becoming.
        </p>
      </section>
    </div>
  );
}
