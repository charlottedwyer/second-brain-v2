import { useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Today from "./pages/Today";
import Wiki from "./pages/Wiki";
import Notes from "./pages/Notes";
import Media from "./pages/Media";
import Health from "./pages/Health";
import HealthHabits from "./pages/HealthHabits";
import HealthMedications from "./pages/HealthMedications";
import Stats from "./pages/Stats";
import Settings from "./pages/Settings";

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  function handleSetTheme(t: string) {
    if (t === "light" || t === "dark") {
      setTheme(t);
    }
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* TOP NAV BAR */}
      <header
        style={{
          height: 56,
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          gap: 16,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          flexShrink: 0,
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
      </header>

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
