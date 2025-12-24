import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

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

  function QuickCard({
    title,
    description,
    path,
  }: {
    title: string;
    description: string;
    path: string;
  }) {
    return (
      <div
        className="card"
        onClick={() => navigate(path)}
        style={{ cursor: "pointer" }}
      >
        <div className="card-header">
          <h2>{title}</h2>
        </div>
        <div className="card-body">
          <p>{description}</p>
          <button onClick={() => navigate(path)}>Open</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <header className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p className="dashboard-subtitle">
            Your second brain, at a glance.
          </p>
        </div>

        <div className="dashboard-actions">
          <ThemePicker theme={theme} setTheme={setTheme} />
          <button onClick={signOut} disabled={loading}>
            {loading ? "Signing out…" : "Log out"}
          </button>
        </div>
      </header>

      {/* TODAY */}
      <div className="card">
        <div className="card-header">
          <h2>Today</h2>
        </div>
        <div className="card-body">
          <Today />
        </div>
      </div>

      {/* QUICK ACCESS */}
      <div className="dashboard-grid">
        {/* LEFT COLUMN */}
        <div>
          <div className="card">
            <div className="card-header">
              <h2>Reflection</h2>
            </div>
            <div className="card-body">
              <Reflection />
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2>Stats</h2>
            </div>
            <div className="card-body">
              <Stats />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div>
          <QuickCard
            title="Notes"
            description="Create and edit your notes."
            path="/notes"
          />

          <QuickCard
            title="Calendar"
            description="View upcoming events and schedules."
            path="/calendar"
          />

          <QuickCard
            title="Wiki"
            description="Your personal knowledge base."
            path="/wiki"
          />

          <QuickCard
            title="Media"
            description="Books, films, shows, and more."
            path="/media"
          />
        </div>
      </div>
    </div>
  );
}
