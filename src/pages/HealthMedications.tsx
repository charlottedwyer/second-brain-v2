import Medications from "./Medications";

export default function HealthMedications() {
  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1>Medications</h1>
          <p className="page-subtitle">
            Manage prescriptions, reminders, and treatment details.
          </p>
        </div>
      </header>

      <div className="card">
        <div className="card-body">
          <Medications />
        </div>
      </div>
    </div>
  );
}
