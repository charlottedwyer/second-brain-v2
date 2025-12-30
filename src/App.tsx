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
import Media from "./pages/Media";
import Health from "./pages/Health";
import HealthHabits from "./pages/HealthHabits";
import HealthMedications from "./pages/HealthMedications";
import MedicationsSetup from "./pages/MedicationsSetup";
import Stats from "./pages/Stats";
import Settings from "./pages/Settings";

type Theme = "light" | "dark";

export default function App() {
  const location = useLocation();

  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("theme");
    return stored === "light" || stored === "dark"
      ? stored
      : "dark";
  });

  function handleSetTheme(t: string) {
    if (t === "light" || t === "dark") {
      setTheme(t);
    }
  }

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const inHealthSection = location.pathname.startsWith("/health");
  const inWikiSection = location.pathname.startsWith("/wiki");

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* GLOBAL + CONTEXT NAV */}
      <header
        style={{
          display: "flex",
          flexDirection: "column",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          flexShrink: 0,
        }}
      >
        {/* PRIMARY NAV */}
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

          {/* SPACER */}
          <div style={{ flex: 1 }} />

          {/* THEME TOGGLE */}
          <div
            style={{
              display: "flex",
              gap: 6,
              padding: 4,
              borderRadius: 999,
              background: "rgba(160,120,255,0.15)",
            }}
          >
            <ThemeButton
              active={theme === "light"}
              onClick={() => handleSetTheme("light")}
            >
              ☀️
            </ThemeButton>
            <ThemeButton
              active={theme === "dark"}
              onClick={() => handleSetTheme("dark")}
            >
              🌙
            </ThemeButton>
          </div>
        </div>

        {/* WIKI SUB NAV */}
        {inWikiSection && (
          <div
            style={{
              display: "flex",
              gap: 12,
              padding: "6px 20px 10px",
              background: "rgba(160,120,255,0.08)",
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

        {/* HEALTH SUB NAV */}
        {inHealthSection && (
          <div
            style={{
              display: "flex",
              gap: 12,
              padding: "6px 20px 10px",
              background: "rgba(160,120,255,0.08)",
            }}
          >
            <SubNavItem to="/health" label="Overview" end />
            <SubNavItem to="/health/habits" label="Habits" />
            <SubNavItem to="/health/medications" label="Medications" />
            <SubNavItem
              to="/health/medications/setup"
              label="Setup"
            />
          </div>
        )}
      </header>

      {/* PAGE CONTENT */}
      <main style={{ flex: 1, overflow: "hidden" }}>
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                theme={theme}
                setTheme={handleSetTheme}
              />
            }
          />
          <Route path="/today" element={<Today />} />
          <Route path="/wiki" element={<Wiki />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/media" element={<Media />} />

          {/* HEALTH */}
          <Route path="/health" element={<Health />} />
          <Route path="/health/habits" element={<HealthHabits />} />
          <Route
            path="/health/medications"
            element={<HealthMedications />}
          />
          <Route
            path="/health/medications/setup"
            element={<MedicationsSetup />}
          />

          <Route path="/stats" element={<Stats />} />
          <Route
            path="/settings"
            element={
              <Settings
                theme={theme}
                setTheme={handleSetTheme}
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

/* -------------------- NAV COMPONENTS -------------------- */

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
          ? "rgba(160,120,255,0.22)"
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
          ? "rgba(160,120,255,0.25)"
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
          ? "rgba(160,120,255,0.35)"
          : "transparent",
        borderRadius: "50%",
        width: 28,
        height: 28,
        cursor: "pointer",
        fontSize: 14,
      }}
    >
      {children}
    </button>
  );
}
