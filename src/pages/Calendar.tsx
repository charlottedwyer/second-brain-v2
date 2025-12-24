import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

/* =====================
   TYPES
   ===================== */

type CalendarEvent = {
  id: number;
  title: string;
  date: string; // YYYY-MM-DD (LOCAL)
  color: string; // hex or named colour
};

type ViewMode = "month" | "week" | "agenda";

/* =====================
   DATE HELPERS (LOCAL SAFE)
   ===================== */

function toLocalDateString(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

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

/* =====================
   COMPONENT
   ===================== */

export default function Calendar() {
  const today = new Date();

  const [view, setView] = useState<ViewMode>("month");
  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [newTitle, setNewTitle] = useState("");
  const [newColor, setNewColor] = useState("#7c83ff");

  useEffect(() => {
    fetchEvents();
  }, [currentMonth]);

  /* =====================
     DATA
     ===================== */

  async function fetchEvents() {
    const start = toLocalDateString(currentMonth);
    const end = toLocalDateString(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0
      )
    );

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
        color: newColor,
      },
    ]);

    setNewTitle("");
    fetchEvents();
  }

  /* =====================
     RENDER HELPERS
     ===================== */

  const days = getMonthDays(
    currentMonth.getFullYear(),
    currentMonth.getMonth()
  );

  const eventsForSelectedDay = events.filter(
    (e) => e.date === selectedDate
  );

  /* =====================
     UI
     ===================== */

  return (
    <div className="page-container">
      {/* HEADER */}
      <header className="page-header">
        <div>
          <h1>Calendar</h1>
          <p className="page-subtitle">
            Plan ahead, track events, stay oriented.
          </p>
        </div>

        <div className="page-actions">
          <select
            value={view}
            onChange={(e) => setView(e.target.value as ViewMode)}
          >
            <option value="month">Month</option>
            <option value="week">Week</option>
            <option value="agenda">Agenda</option>
          </select>

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

          <strong>
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

      {/* =====================
         MONTH VIEW
         ===================== */}
      {view === "month" && (
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
              style={{ textAlign: "center", opacity: 0.6, fontSize: 13 }}
            >
              {d}
            </div>
          ))}

          {days.map((day, i) => {
            if (!day) {
              return <div key={i} />;
            }

            const dateStr = toLocalDateString(day);
            const dayEvents = events.filter(
              (e) => e.date === dateStr
            );

            return (
              <div
                key={i}
                onClick={() => setSelectedDate(dateStr)}
                style={{
                  minHeight: 90,
                  padding: 8,
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  background:
                    selectedDate === dateStr
                      ? "var(--border)"
                      : "var(--card)",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontSize: 12, marginBottom: 6 }}>
                  {day.getDate()}
                </div>

                {dayEvents.map((e) => (
                  <div
                    key={e.id}
                    style={{
                      height: 6,
                      borderRadius: 4,
                      background: e.color,
                      marginBottom: 4,
                    }}
                  />
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* =====================
         AGENDA VIEW
         ===================== */}
      {view === "agenda" && (
        <div className="card">
          <div className="card-body">
            {events.map((e) => (
              <div
                key={e.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: e.color,
                  }}
                />
                <strong>{e.title}</strong>
                <span style={{ opacity: 0.6 }}>{e.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================
         EVENT PANEL
         ===================== */}
      {selectedDate && (
        <div className="card">
          <div className="card-header">
            <h2>{selectedDate}</h2>
          </div>

          <div className="card-body">
            <ul>
              {eventsForSelectedDay.map((e) => (
                <li key={e.id} style={{ color: e.color }}>
                  {e.title}
                </li>
              ))}
            </ul>

            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 12,
                alignItems: "center",
              }}
            >
              <input
                placeholder="Event title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />

              <input
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
              />

              <button onClick={addEvent}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
