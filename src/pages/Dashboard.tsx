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
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
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
        {/* LEFT */}
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

        {/* RIGHT */}
        <div>
          <div className="card">
            <div className="card-header">
              <h2>Notes</h2>
            </div>
            <div className="card-body">
              <p>Create and edit your notes.</p>
              <button onClick={() => navigate("/notes")}>
                Open Notes
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2>Calendar</h2>
            </div>
            <div className="card-body">
              <p>View upcoming events.</p>
              <button onClick={() => navigate("/calendar")}>
                Open Calendar
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2>Wiki</h2>
            </div>
            <div className="card-body">
              <p>Your personal knowledge base.</p>
              <button onClick={() => navigate("/wiki")}>
                Open Wiki
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2>Media</h2>
            </div>
            <div className="card-body">
              <p>Books, films, shows, and more.</p>
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
