import HabitsList from "../components/HabitsList";

export default function HabitsPage() {
  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1>Habits</h1>
          <p className="page-subtitle">
            Build routines and track daily consistency.
          </p>
        </div>
      </header>

      <div className="card">
        <HabitsList />
      </div>
    </div>
  );
}
