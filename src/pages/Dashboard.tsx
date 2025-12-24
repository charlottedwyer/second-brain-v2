import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

import Notes from "./Notes";
import Notebooks from "./Notebooks";
import Wiki from "./Wiki";
import Calendar from "./Calendar";
import Habits from "./Habits";
import Media from "./Media";
import Today from "./Today";
import Reflection from "./Reflection";
import Stats from "./Stats";

import ThemePicker from "../components/ThemePicker";

type DashboardProps = {
  theme: string;
  setTheme: (t: string) => void;
};

export default function Dashboard({ theme, setTheme }: DashboardProps) {
  const [activeNotebook, setActiveNotebook] = useState<string | null>(null);

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <header className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p className="dashboard-subtitle">
            Your second brain, in progress.
          </p>
        </div>

        <div className="dashboard-actions">
          <ThemePicker theme={theme} setTheme={setTheme} />
          <button onClick={signOut}>Log out</button>
        </div>
      </header>

      {/* TODAY */}
      <div className="card">
        <div className="card-body">
          <Today />
        </div>
      </div>

      {/* MAIN GRID */}
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
              <h2>Notes</h2>
            </div>
            <div className="card-body">
              <Notebooks
                activeNotebook={activeNotebook}
                onSelect={setActiveNotebook}
              />
              <Notes notebookId={activeNotebook} />
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2>Wiki</h2>
            </div>
            <div className="card-body">
              <Wiki />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div>
          <div className="card">
            <div className="card-header">
              <h2>Calendar</h2>
            </div>
            <div className="card-body">
              <Calendar />
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2>Habits</h2>
            </div>
            <div className="card-body">
              <Habits />
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2>Weekly Stats</h2>
            </div>
            <div className="card-body">
              <Stats />
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2>Media</h2>
            </div>
            <div className="card-body">
              <Media />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
