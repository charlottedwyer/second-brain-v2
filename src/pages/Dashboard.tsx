import { supabase } from "../lib/supabaseClient";
import Notes from "./Notes";
import Media from "./Media";
import Wiki from "./Wiki";

export default function Dashboard() {
  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <div style={{ padding: 24 }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <h1>Dashboard</h1>
          <p style={{ opacity: 0.7 }}>
            Your second brain, in progress.
          </p>
        </div>

        <button onClick={signOut}>Log out</button>
      </header>

      <section style={{ marginBottom: 32 }}>
        <h2>Notes</h2>
        <Notes />
      </section>

      <section style={{ marginBottom: 32 }}>
        <Media />
      </section>

      <section>
        <Wiki />
      </section>
    </div>
  );
}
