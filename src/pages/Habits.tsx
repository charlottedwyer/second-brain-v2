import Medications from "./Medications";
import HabitsTracker from "./HabitsTracker";

export default function Habits() {
  return (
    <div className="page-container">
      {/* PAGE HEADER */}
      <header className="page-header">
        <div>
          <h1>Health</h1>
          <p className="page-subtitle">
            Habits, routines, and medications — all in one place.
          </p>
        </div>
      </header>

      {/* TODAY */}
      <div className="card">
        <div className="card-header">
          <h2>Today</h2>
        </div>
        <div className="card-body">
          <HabitsTracker />
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
