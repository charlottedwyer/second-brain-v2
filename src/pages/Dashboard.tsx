import { supabase } from "../lib/supabaseClient";
import Notes from "./Notes";
import Media from "./Media";
import Wiki from "./Wiki";

export default function Dashboard() {
  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 32,
        }}
      >
        <div>
          <h1 style={{ marginBottom: 4 }}>Dashboard</h1>
          <p style={{ opacity: 0.7, margin: 0 }}>
            Your second brain, in progress.
          </p>
        </div>

        <button onClick={signOut}>Log out</button>
      </header>

      <div className="card">
        <div className="card-header">
          <h2>Notes</h2>
        </div>
        <div className="card-body">
          <Notes />
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

      <div className="card">
        <div className="card-header">
          <h2>Wiki</h2>
        </div>
        <div className="card-body">
          <Wiki />
        </div>
      </div>
    </div>
  );
}
