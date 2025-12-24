import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type CalendarEvent = {
  id: number;
  title: string;
  date: string; // YYYY-MM-DD
};

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const days: (Date | null)[] = [];

  for (let i = 0; i < firstDay.getDay(); i++) {
    days.push(null);
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }

  return days;
}

export default function Calendar() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    fetchEvents();
  }, [currentMonth]);

  async function fetchEvents() {
    const start = currentMonth.toISOString().split("T")[0];
    const end = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    )
      .toISOString()
      .split("T")[0];

    const { data } = await supabase
      .from("calendar_events")
      .select("*")
      .gte("date", start)
      .lte("date", end);

    if (data) setEvents(data);
  }

  async function addEvent() {
    if (!selectedDate || !newTitle) return;

    await supabase.from("calendar_events").insert([
      {
        title: newTitle,
        date: selectedDate,
      },
    ]);

    setNewTitle("");
    fetchEvents();
  }

  const days = getMonthDays(
    currentMonth.getFullYear(),
    currentMonth.getMonth()
  );

  return (
    <div className="page-container">
      {/* PAGE HEADER */}
      <header className="page-header">
        <div>
          <h1>Calendar</h1>
          <p className="page-subtitle">
            Plan ahead, track events, stay oriented.
          </p>
        </div>

        <div className="page-actions">
          <button
            onClick={() =>
              setCurrentMonth(
                new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth() - 1,
                  1
                )
              )
            }
          >
            ◀
          </button>

          <strong style={{ alignSelf: "center" }}>
            {currentMonth.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </strong>

          <button
            onClick={() =>
              setCurrentMonth(
                new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth() + 1,
                  1
                )
              )
            }
          >
            ▶
          </button>
        </div>
      </header>

      {/* CALENDAR GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 8,
          marginBottom: 24,
        }}
      >
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div
            key={d}
            style={{
              textAlign: "center",
              opacity: 0.6,
              fontSize: 13,
            }}
          >
            {d}
          </div>
        ))}

        {days.map((day, i) => {
          const dateStr = day
            ? day.toISOString().split("T")[0]
            : null;

          const dayEvents = events.filter(
            (e) => e.date === dateStr
          );

          return (
            <div
              key={i}
              onClick={() => dateStr && setSelectedDate(dateStr)}
              style={{
                minHeight: 80,
                padding: 8,
                borderRadius: 12,
                border: "1px solid var(--border)",
                background:
                  selectedDate === dateStr
                    ? "var(--border)"
                    : "var(--card)",
                opacity: day ? 1 : 0,
                cursor: day ? "pointer" : "default",
              }}
            >
              {day && (
                <>
                  <div style={{ fontSize: 12, marginBottom: 4 }}>
                    {day.getDate()}
                  </div>

                  {dayEvents.length > 0 && (
                    <div style={{ fontSize: 11, opacity: 0.7 }}>
                      {dayEvents.length} event
                      {dayEvents.length > 1 ? "s" : ""}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* EVENT PANEL */}
      {selectedDate && (
        <div className="card">
          <div className="card-header">
            <h2>
              {new Date(selectedDate).toDateString()}
            </h2>
          </div>

          <div className="card-body">
            <ul>
              {events
                .filter((e) => e.date === selectedDate)
                .map((e) => (
                  <li key={e.id}>{e.title}</li>
                ))}
            </ul>

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <input
                placeholder="Event title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <button onClick={addEvent}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
