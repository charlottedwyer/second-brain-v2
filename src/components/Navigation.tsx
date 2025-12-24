import { NavLink } from "react-router-dom";

const linkStyle = ({ isActive }: { isActive: boolean }) => ({
  padding: "8px 12px",
  borderRadius: 8,
  textDecoration: "none",
  color: "var(--text)",
  background: isActive ? "var(--border)" : "transparent",
});

export default function Navigation() {
  return (
    <nav
      style={{
        display: "flex",
        gap: 8,
        padding: 12,
        borderBottom: "1px solid var(--border)",
        flexWrap: "wrap",
      }}
    >
      <NavLink to="/" style={linkStyle}>
        Dashboard
      </NavLink>
      <NavLink to="/notes" style={linkStyle}>
        Notes
      </NavLink>
      <NavLink to="/calendar" style={linkStyle}>
        Calendar
      </NavLink>
      <NavLink to="/wiki" style={linkStyle}>
        Wiki
      </NavLink>
      <NavLink to="/health" style={linkStyle}>
        Health
      </NavLink>
      <NavLink to="/media" style={linkStyle}>
        Media
      </NavLink>
      <NavLink to="/stats" style={linkStyle}>
        Stats
      </NavLink>
    </nav>
  );
}
