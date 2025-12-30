import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  NavLink,
  useLocation,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Today from "./pages/Today";
import Wiki from "./pages/Wiki";
import Notes from "./pages/Notes";
import Media from "./features/media/MediaList";
import Health from "./pages/Health";
import Routines from "./pages/Routines";
import MedicationsSetup from "./features/medications/MedicationsSetup";
import Stats from "./pages/Stats";
import Settings from "./pages/Settings";

type ThemePalette = "lavender" | "forest" | "noir";
type ThemeMode = "light" | "dark";

export type ThemeConfig = {
  palette: ThemePalette;
  mode: ThemeMode;
};

export default function App() {
  const location = useLocation();

  const [theme, setTheme] = useState<ThemeConfig>(() => {
    const stored = localStorage.getItem("theme");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (
          (parsed.palette === "lavender" ||
            parsed.palette === "forest" ||
            parsed.palette === "noir") &&
          (parsed.mode === "light" || parsed.mode === "dark")
        ) {
          return parsed;
        }
      } catch {}
    }

    return { palette: "lavender", mode: "dark" };
  });

  function setThemeMode(mode: ThemeMode) {
    setTheme((t) => ({ ...t, mode }));
  }

  function setThemePalette(palette: ThemePalette) {
    setTheme((t) => ({ ...t, palette }));
  }

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(theme));
    document.documentElement.dataset.theme = theme.mode;
    document.documentElement.dataset.palette = theme.palette;
  }, [theme]);

  const inHealthSection = location.pathname.startsWith("/health");
  const inWikiSection = location.pathname.startsWith("/wiki");

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <header
        style={{
          display: "flex",
          flexDirection: "column",
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            height: 56,
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            gap: 16,
          }}
        >
          <div style={{ fontWeight: "bold", fontSize: 18 }}>
            Second Brain
          </div>

          <NavItem to="/today" label="Today" />
          <NavItem to="/" label="Dashboard" end />
          <NavItem to="/wiki" label="Wiki" />
          <NavItem to="/notes" label="Notes" />
          <NavItem to="/media" label="Media" />
          <NavItem to="/health" label="Health" />
          <NavItem to="/stats" label="Stats" />
          <NavItem to="/settings" label="Settings" />

          <div style={{ flex: 1 }} />

          <div
            style={{
              display: "flex",
              gap: 6,
              padding: 4,
              borderRadius: 999,
              background: "var(--accent-soft)",
            }}
          >
            <ThemeButton
              active={theme.mode === "light"}
              onClick={() => setThemeMode("light")}
            >
              ☀️
            </ThemeButton>
            <ThemeButton
              active={theme.mode === "dark"}
              onClick={() => setThemeMode("dark")}
            >
              🌙
            </ThemeButton>
          </div>
        </div>

        {inWikiSection && (
          <div
            style={{
              display: "flex",
              gap: 12,
              padding: "6px 20px 10px",
              background: "var(--accent-soft)",
            }}
          >
            <SubNavItem to="/wiki" label="All Pages" end />
            <span
              style={{
                opacity: 0.6,
                fontSize: 13,
                alignSelf: "center",
              }}
            >
              Use the sidebar to navigate structure
            </span>
          </div>
        )}

        {inHealthSection && (
          <div
            style={{
              display: "flex",
              gap: 12,
              padding: "6px 20px 10px",
              background: "var(--accent-soft)",
            }}
          >
            <SubNavItem to="/health" label="Overview" end />
            <SubNavItem to="/health/routines" label="Routines" />
            <SubNavItem to="/health/medications/setup" label="Medications" />
          </div>
        )}
      </header>

      <main style={{ flex: 1, overflow: "hidden" }}>
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                theme={theme.mode}
                setTheme={(t) => setThemeMode(t as ThemeMode)}
              />
            }
          />
          <Route path="/today" element={<Today />} />
          <Route path="/wiki" element={<Wiki />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/media" element={<Media />} />
          <Route path="/health" element={<Health />} />
          <Route path="/health/routines" element={<Routines />} />
          <Route
            path="/health/medications/setup"
            element={<MedicationsSetup />}
          />
          <Route path="/stats" element={<Stats />} />
          <Route
            path="/settings"
            element={
              <Settings
                mode={theme.mode}
                palette={theme.palette}
                setMode={setThemeMode}
                setPalette={setThemePalette}
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

function NavItem({
  to,
  label,
  end = false,
}: {
  to: string;
  label: string;
  end?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      style={({ isActive }) => ({
        padding: "6px 12px",
        borderRadius: 8,
        textDecoration: "none",
        fontWeight: isActive ? "bold" : "normal",
        background: isActive
          ? "var(--accent-soft)"
          : "transparent",
        color: "inherit",
      })}
    >
      {label}
    </NavLink>
  );
}

function SubNavItem({
  to,
  label,
  end = false,
}: {
  to: string;
  label: string;
  end?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      style={({ isActive }) => ({
        padding: "4px 10px",
        borderRadius: 999,
        textDecoration: "none",
        fontSize: 14,
        fontWeight: isActive ? "bold" : "normal",
        background: isActive
          ? "var(--accent-soft)"
          : "transparent",
        color: "inherit",
      })}
    >
      {label}
    </NavLink>
  );
}

function ThemeButton({
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
        border: "none",
        background: active
          ? "var(--accent)"
          : "transparent",
        borderRadius: "50%",
        width: 28,
        height: 28,
        cursor: "pointer",
        fontSize: 14,
        color: active ? "white" : "inherit",
      }}
    >
      {children}
    </button>
  );
}
