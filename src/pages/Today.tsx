export default function Today() {
  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1>Today</h1>
          <p className="page-subtitle">
            A calm overview of what matters today.
          </p>
        </div>
      </header>

      <div className="card">
        <div className="card-body">
          <p style={{ opacity: 0.7 }}>
            Today’s overview will populate once core data sources are connected.
          </p>
        </div>
      </div>
    </div>
  );
}
