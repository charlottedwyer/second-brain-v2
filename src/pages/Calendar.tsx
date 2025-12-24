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

function getMonthDays(base: Date) {
  const year = base.getFullYear();
  const month = base.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);

  const days: (Date | null)[] = [];
  for (let i = 0; i < first.getDay(); i++) days.push(null);
  for (let d = 1; d <= last.getDate(); d++)
    days.push(new Date(year, month, d));

  return days;
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

  async function fetchEvents() {
    const start = toLocalDateString(addDays(anchorDate, -31));
    const end = toLocalDateString(addDays(anchorDate, 31));

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
     RECURRENCE EXPANSION
     ===================== */

  function eventsForDate(dateStr: string) {
    return events.filter((e) => {
      if (e.date === dateStr) return true;

      if (e.recurrence === "daily") return e.date <= dateStr;

      if (e.recurrence === "weekly") {
        const base = new Date(e.date);
        const target = new Date(dateStr);
        return base <= target && base.getDay() === target.getDay();
      }

      return false;
    });
  }

  /* =====================
     MONTH VIEW
     ===================== */

  const monthDays = getMonthDays(anchorDate);

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
            <div key={d} style={{ opacity: 0.6, fontSize: 13 }}>
              {d}
            </div>
          ))}

          {monthDays.map((d, i) => {
            if (!d) return <div key={i} />;

            const dateStr = toLocalDateString(d);
            const dayEvents = eventsForDate(dateStr);

            return (
              <div
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  padding: 8,
                  minHeight: 80,
                  cursor: "pointer",
                }}
              >
                <div style={{ fontSize: 12 }}>{d.getDate()}</div>
                {dayEvents.slice(0, 3).map((e) => (
                  <div
                    key={e.id}
                    style={{
                      height: 6,
                      borderRadius: 4,
                      background: e.color,
                      marginTop: 4,
                    }}
                  />
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* =====================
         WEEK VIEW
         ===================== */}
      {view === "week" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "80px repeat(7, 1fr)",
          }}
        >
          <div />

          {weekDays.map((d) => (
            <div key={d.toDateString()} style={{ textAlign: "center" }}>
              <strong>
                {d.toLocaleDateString(undefined, { weekday: "short" })}
              </strong>
              <div style={{ opacity: 0.6 }}>{d.getDate()}</div>
            </div>
          ))}

          {Array.from({ length: 24 }).map((_, hour) => (
            <div key={`hour-${hour}`} style={{ display: "contents" }}>
              <div style={{ fontSize: 12, opacity: 0.6 }}>
                {hour}:00
              </div>

              {weekDays.map((d) => {
                const dateStr = toLocalDateString(d);

                return (
                  <div
                    key={dateStr + hour}
                    onClick={() => setSelectedDate(dateStr)}
                    style={{
                      border: "1px solid var(--border)",
                      minHeight: 40,
                      position: "relative",
                    }}
                  >
                    {eventsForDate(dateStr)
                      .filter(
                        (e) =>
                          e.start_time &&
                          parseInt(e.start_time.split(":")[0]) === hour
                      )
                      .map((e) => (
                        <div
                          key={e.id}
                          style={{
                            position: "absolute",
                            top: 2,
                            left: 2,
                            right: 2,
                            height: Math.max(
                              30,
                              ((e.duration_minutes || 30) / 60) * 40
                            ),
                            background: e.color,
                            color: "#fff",
                            fontSize: 11,
                            borderRadius: 6,
                            padding: 4,
                          }}
                        >
                          {e.title}
                        </div>
                      ))}
                  </div>
                );
              })}
            </div>
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
