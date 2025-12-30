import HabitsList from "../components/HabitsList";

export default function RoutinesPage() {
  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1>Routines</h1>
          <p className="page-subtitle">
            Daily habits that support your health and wellbeing.
          </p>
        </div>
      </header>

      <div className="card">
        <HabitsList />
      </div>
    </div>
  );
}
