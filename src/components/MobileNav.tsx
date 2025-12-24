import { NavLink } from "react-router-dom";

const tabs = [
  { to: "/", label: "Home" },
  { to: "/notes", label: "Notes" },
  { to: "/calendar", label: "Calendar" },
  { to: "/health", label: "Health" },
  { to: "/media", label: "Media" },
];

export default function MobileNav() {
  return (
    <nav className="mobile-nav">
      {tabs.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          className={({ isActive }) =>
            `mobile-nav-item ${isActive ? "active" : ""}`
          }
        >
          {t.label}
        </NavLink>
      ))}
    </nav>
  );
}
