import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type CalendarEvent = {
  id: string;
  title: string;
  event_date: string;
  event_time: string | null;
};

type Habit = {
  id: string;
  name: string;
};

type HabitLog = {
  habit_id: string;
};

type Note = {
  id: string;
  title: string;
  content: string;
};

export default function Today() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);

  const today = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => today.toISOString().slice(0, 10), [today]);

  async function loadToday() {
    // Events (today)
    const eventsRes = await supabase
      .from("calendar_events")
      .select("id, title, event_date, event_time")
      .eq("event_date", todayStr)
      .order("event_time", { ascending: true });

    setEvents(eventsRes.data ?? []);

    // Habits + logs (today)
    const habitsRes = await supabase
      .from("habits")
      .select("id, name")
      .order("created_at", { ascending: true });

    setHabits(habitsRes.data ?? []);

    const logsRes = await supabase
      .from("habit_logs")
      .select("habit_id")
      .eq("log_date", todayStr);

    setLogs(logsRes.data ?? []);

    // Notes created today
    // Use a date range in UTC (good enough for v1; we can refine to local time later)
    const start = `${todayStr}T00:00:00.000Z`;
    const end = `${todayStr}T23:59:59.999Z`;

    const notesRes = await supabase
      .from("notes")
      .select("id, title, content")
      .gte("created_at", start)
      .lte("created_at", end)
      .order("created_at", { ascending: false });

    setNotes(notesRes.data ?? []);
  }

  useEffect(() => {
    loadToday();
  }, [todayStr]);

  const doneSet = new Set(logs.map((l) => l.habit_id));
  const doneCount = habits.filter((h) => doneSet.has(h.id)).length;

  return (
    <div>
      <p style={{ opacity: 0.7, marginBottom: 12 }}>
        {todayStr}
      </p>

      <div style={{ marginBottom: 16 }}>
        <h3 style={{ margin: "0 0 6px 0" }}>Events</h3>
        {events.length === 0 ? (
          <p style={{ opacity: 0.7, margin: 0 }}>No events today.</p>
        ) : (
          <ul>
            {events.map((e) => (
              <li key={e.id}>
                <strong>{e.title}</strong>{" "}
                <span style={{ opacity: 0.7 }}>
                  {e.event_time ? `• ${e.event_time}` : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginBottom: 16 }}>
        <h3 style={{ margin: "0 0 6px 0" }}>Habits</h3>
        {habits.length === 0 ? (
          <p style={{ opacity: 0.7, margin: 0 }}>No habits yet.</p>
        ) : (
          <p style={{ margin: 0, opacity: 0.85 }}>
            Done today: {doneCount}/{habits.length}
          </p>
        )}
      </div>

      <div>
        <h3 style={{ margin: "0 0 6px 0" }}>Notes today</h3>
        {notes.length === 0 ? (
          <p style={{ opacity: 0.7, margin: 0 }}>No notes yet today.</p>
        ) : (
          <ul>
            {notes.slice(0, 5).map((n) => (
              <li key={n.id}>
                <strong>{n.title}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
