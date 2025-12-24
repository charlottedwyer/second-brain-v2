import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

/* =====================
   TYPES
   ===================== */

type Recurrence = "none" | "daily" | "weekly";
type ViewMode = "month" | "week" | "agenda";

type CalendarEvent = {
  id: number;
  title: string;
  date: string; // YYYY-MM-DD
  start_time: string | null; // HH:MM
  duration_minutes: number | null;
  recurrence: Recurrence;
  color: string;
};

/* =====================
   DATE HELPERS (LOCAL SAFE)
   ===================== */

function toLocalDateString(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function getWeekDays(base: Date) {
  const start = addDays(base, -base.getDay());
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

/* =====================
   COMPONENT
   ===================== */

export default function Calendar() {
  const today = new Date();

  const [view, setView] = useState<ViewMode>("month");
  const [anchorDate, setAnchorDate] = useState(today);

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // new event form
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [duration, setDuration] = useState(60);
  const [recurrence, setRecurrence] = useState<Recurrence>("none");
  const [color, setColor] = useState("#7c83ff");

  useEffect(() => {
    fetchEvents();
  }, [anchorDate]);

  /* =====================
     DATA
     ===================== */

  async function fetchEvents() {
    const start = toLocalDateString(addDays(anchorDate, -30));
    const end = toLocalDateString(addDays(anchorDate, 30));

    const { data } = await supabase
      .from("calendar_events")
      .select("*")
      .gte("date", start)
      .lte("date", end);

    if (data) setEvents(data);
  }

  async function addEvent() {
    if (!selectedDate || !title) return;

    await supabase.from("calendar_events").insert([
      {
        title,
        date: selectedDate,
        start_time: startTime,
        duration_minutes: duration,
        recurrence,
        color,
      },
    ]);

    setTitle("");
    fetchEvents();
  }

  /* =====================
     DERIVED EVENTS (RECURRING)
     ===================== */

  function expandRecurringEvents(baseDate: string) {
    return events.filter((e) => {
      if (e.date === baseDate) return true;

      if (e.recurrence === "daily") return e.date <= baseDate;

      if (e.recurrence === "weekly") {
        const base = new Date(e.date);
        const target = new Date(baseDate);
        return (
          base <= target && base.getDay() === target.getDay()
        );
      }

      return false;
    });
  }

  /* =====================
     WEEK VIEW
     ===================== */

  const weekDays = getWeekDays(anchorDate);

  return (
    <div className="page-container">
      {/* HEADER */}
      <header className="page-header">
        <div>
          <h1>Calendar</h1>
          <p className="page-subtitle">
            Schedule your time, not just your days.
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

          <button onClick={() => setAnchorDate(addDays(anchorDate, -7))}>
            ◀
          </button>

          <strong>{toLocalDateString(anchorDate)}</strong>

          <button onClick={() => setAnchorDate(addDays(anchorDate, 7))}>
            ▶
          </button>
        </div>
      </header>

      {/* =====================
         WEEK VIEW
         ===================== */}
      {view === "week" && (
        <div style={{ display: "grid", gridTemplateColumns: "80px repeat(7, 1fr)" }}>
          <div />

          {weekDays.map((d) => (
            <div key={d.toString()} style={{ textAlign: "center" }}>
              <strong>{d.toLocaleDateString(undefined, { weekday: "short" })}</strong>
              <div style={{ opacity: 0.6 }}>{d.getDate()}</div>
            </div>
          ))}

          {Array.from({ length: 24 }).map((_, hour) => (
            <>
              <div key={`h-${hour}`} style={{ fontSize: 12, opacity: 0.6 }}>
                {hour}:00
              </div>

              {weekDays.map((d) => {
                const dateStr = toLocalDateString(d);
                const dayEvents = expandRecurringEvents(dateStr).filter(
                  (e) => e.start_time?.startsWith(String(hour).padStart(2, "0"))
                );

                return (
                  <div
                    key={dateStr + hour}
                    onClick={() => setSelectedDate(dateStr)}
                    style={{
                      border: "1px solid var(--border)",
                      minHeight: 40,
                      padding: 2,
                    }}
                  >
                    {dayEvents.map((e) => (
                      <div
                        key={e.id}
                        style={{
                          background: e.color,
                          color: "#fff",
                          borderRadius: 4,
                          padding: "2px 4px",
                          fontSize: 11,
                        }}
                      >
                        {e.title}
                      </div>
                    ))}
                  </div>
                );
              })}
            </>
          ))}
        </div>
      )}

      {/* =====================
         AGENDA VIEW
         ===================== */}
      {view === "agenda" && (
        <div className="card">
          <div className="card-body">
            {events.map((e) => (
              <div key={e.id} style={{ marginBottom: 8 }}>
                <span style={{ color: e.color }}>●</span>{" "}
                <strong>{e.title}</strong> — {e.date}{" "}
                {e.start_time && `@ ${e.start_time}`}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================
         EVENT CREATION
         ===================== */}
      {selectedDate && (
        <div className="card">
          <div className="card-header">
            <h2>Add event — {selectedDate}</h2>
          </div>

          <div className="card-body">
            <input
              placeholder="Event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />

            <input
              type="number"
              min={15}
              step={15}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />

            <select
              value={recurrence}
              onChange={(e) => setRecurrence(e.target.value as Recurrence)}
            >
              <option value="none">One-time</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>

            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />

            <button onClick={addEvent}>Add event</button>
          </div>
        </div>
      )}
    </div>
  );
}
