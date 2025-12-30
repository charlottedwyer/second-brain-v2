import CalendarView from "../features/calendar/CalendarView";

export default function Calendar() {
  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Calendar</h1>
        <p className="page-subtitle">
          Schedule your time, not just your days.
        </p>
      </header>

      <CalendarView />
    </div>
  );
}
