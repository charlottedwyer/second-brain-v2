export default function ThemePicker({
  theme,
  setTheme,
}: {
  theme: string;
  setTheme: (t: string) => void;
}) {
  const themes = [
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
    { id: "lavender", label: "Lavender" },
    { id: "forest", label: "Forest" },
    { id: "warm", label: "Warm" },
  ];

  return (
    <div style={{ display: "flex", gap: 6 }}>
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          style={{
            fontWeight: theme === t.id ? "bold" : "normal",
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
