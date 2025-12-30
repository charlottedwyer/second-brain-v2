import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

import Today from "./Today";
import Reflection from "./Reflection";
import Stats from "./Stats";
import ThemePicker from "../components/ThemePicker";

type DashboardProps = {
  theme: string;
  setTheme: (t: string) => void;
};

export default function Dashboard({ theme, setTheme }: DashboardProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function signOut() {
    if (loading) return;
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
  }

  return (
    <div className="page-container">
      {/* HEADER */}
      <header className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="page-subtitle">
            Your second brain, at a glance.
          </p>
        </div>

        <div className="page-actions">
          <ThemePicker theme={theme} setTheme={setTheme} />
          <button
            className="secondary"
            onClick={signOut}
            disabled={loading}
          >
            {loading ? "Signing out…" : "Log out"}
          </button>
        </div>
      </header>

      {/* TODAY */}
      <div className="card">
        <h2>Today</h2>
        <Today />
      </div>

      {/* MAIN GRID */}
      <div className="dashboard-grid">
        {/* LEFT COLUMN */}
        <div>
          <div className="card">
            <h2>Reflection</h2>
            <Reflection />
          </div>

          <div className="card">
            <h2>Stats</h2>
            <Stats />
          </div>
        </div>

        {/* RIGHT COLUMN — QUICK LINKS */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <QuickLink
            title="Notes"
            description="Thoughts, drafts, and fragments."
            onClick={() => navigate("/notes")}
          />

          <QuickLink
            title="Wiki"
            description="Your personal knowledge base."
            onClick={() => navigate("/wiki")}
          />

          <QuickLink
            title="Health"
            description="Habits, routines, and care."
            onClick={() => navigate("/health")}
          />

          <QuickLink
            title="Media"
            description="Books, films, and shows."
            onClick={() => navigate("/media")}
          />
        </div>
      </div>
    </div>
  );
}

/* --------------------------------
   Small presentational helper
--------------------------------- */

function QuickLink({
  title,
  description,
  onClick,
}: {
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <div
      className="card"
      style={{
        cursor: "pointer",
        transition: "transform 0.12s ease, box-shadow 0.12s ease",
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform =
          "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform =
          "translateY(0)";
      }}
    >
      <h2>{title}</h2>
      <p style={{ opacity: 0.7, margin: "4px 0 12px" }}>
        {description}
      </p>
      <button className="secondary">Open</button>
    </div>
  );
}
