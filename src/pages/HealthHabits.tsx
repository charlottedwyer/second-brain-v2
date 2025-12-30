import Habits from "./Habits";

export default function HealthHabits() {
  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1>Habits</h1>
          <p className="page-subtitle">
            Build and track daily routines that support your health.
          </p>
        </div>
      </header>

      <div className="card">
        <div className="card-body">
          <Habits />
        </div>
      </div>
    </div>
  );
}
