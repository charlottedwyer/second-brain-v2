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

  return (
    <div className="dashboard-container">
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
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
          <h2>Today</h2>
          <Today />
        </div>

        {/* GRID */}
        <div className="dashboard-grid">
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

          <div>
            <div className="card">
              <h2>Notes</h2>
              <button onClick={() => navigate("/notes")}>Open Notes</button>
            </div>

            <div className="card">
              <h2>Calendar</h2>
              <button onClick={() => navigate("/calendar")}>
                Open Calendar
              </button>
            </div>

            <div className="card">
              <h2>Wiki</h2>
              <button onClick={() => navigate("/wiki")}>Open Wiki</button>
            </div>

            <div className="card">
              <h2>Health</h2>
              <button onClick={() => navigate("/health")}>
                Open Health
              </button>
            </div>

            <div className="card">
              <h2>Media</h2>
              <button onClick={() => navigate("/media")}>
                Open Media
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
