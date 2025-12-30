import Habits from "./Habits";
import Medications from "../features/medications/MedicationsList";

export default function Health() {
  return (
    <div className="page-container">
      {/* PAGE HEADER */}
      <header className="page-header">
        <div>
          <h1>Health</h1>
          <p className="page-subtitle">
            Habits, routines, and medications — your daily health overview.
          </p>
        </div>
      </header>

      {/* HABITS */}
      <div className="card">
        <div className="card-header">
          <h2>Habits</h2>
        </div>
        <div className="card-body">
          <Habits />
        </div>
      </div>

      {/* MEDICATIONS */}
      <div className="card">
        <div className="card-header">
          <h2>Medications</h2>
        </div>
        <div className="card-body">
          <Medications />
        </div>
      </div>
    </div>
  );
}
