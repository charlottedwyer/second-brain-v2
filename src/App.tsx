import { BrowserRouter } from "react-router-dom";
import Router from "./router";
import { NavLink } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* TOP NAVIGATION BAR */}
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
          <div
            style={{
              fontWeight: "bold",
              fontSize: 18,
              marginRight: 24,
            }}
          >
            Second Brain
          </div>

          <NavItem to="/today" label="Today" />
          <NavItem to="/" label="Dashboard" end />
          <NavItem to="/wiki" label="Wiki" />
          <NavItem to="/notes" label="Notes" />
          <NavItem to="/media" label="Media" />
          <NavItem to="/health" label="Health" />
          <NavItem to="/stats" label="Stats" />
        </header>

        {/* PAGE CONTENT */}
        <main
          style={{
            flex: 1,
            overflow: "hidden",
          }}
        >
          <Router />
        </main>
      </div>
    </BrowserRouter>
  );
}

/* ----------------------------- NAV ITEM ----------------------------- */

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
