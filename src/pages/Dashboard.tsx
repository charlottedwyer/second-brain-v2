import Notes from "./Notes";

export default function Dashboard() {
  return (
    <div style={{ padding: 24 }}>
      <header style={{ marginBottom: 24 }}>
        <h1>Dashboard</h1>
        <p style={{ opacity: 0.7 }}>
          Your second brain, in progress.
        </p>
      </header>

      <section>
        <h2>Notes</h2>
        <Notes />
      </section>
    </div>
  );
}
