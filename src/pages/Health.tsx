import { useNavigate } from "react-router-dom";
import Habits from "./Habits";
import Medications from "./Medications";

export default function Health() {
  const navigate = useNavigate();

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
          <button
            className="secondary"
            style={{ marginTop: 12 }}
            onClick={() => navigate("/habits")}
          >
            Set up habits
          </button>
        </div>
      </div>

      {/* MEDICATIONS */}
      <div className="card">
        <div className="card-header">
          <h2>Medications</h2>
        </div>
        <div className="card-body">
          <Medications />
          <button
            className="secondary"
            style={{ marginTop: 12 }}
            onClick={() => navigate("/medications")}
          >
            Add medication
          </button>
        </div>
      </div>
    </div>
  );
}
