import { NavLink } from "react-router-dom";

export default function Navigation() {
  const links = [
    { to: "/", label: "Dashboard" },
    { to: "/notes", label: "Notes" },
    { to: "/calendar", label: "Calendar" },
    { to: "/wiki", label: "Wiki" },
    { to: "/health", label: "Health" },
    { to: "/media", label: "Media" },
  ];

  return (
    <>
      {/* DESKTOP NAV */}
      <nav
        style={{
          display: "flex",
          gap: 16,
          padding: "12px 24px",
          borderBottom: "1px solid var(--border)",
          background: "var(--card)",
        }}
      >
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end
            style={({ isActive }) => ({
              textDecoration: "none",
              color: isActive ? "var(--accent)" : "var(--text)",
              fontWeight: isActive ? 600 : 400,
            })}
          >
            {l.label}
          </NavLink>
        ))}
      </nav>

      {/* MOBILE BOTTOM NAV */}
      <div className="mobile-nav">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end
            className={({ isActive }) =>
              `mobile-nav-item ${isActive ? "active" : ""}`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </div>
    </>
  );
}
