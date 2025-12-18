import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Event = {
  id: string;
  title: string;
  event_date: string;
  event_time: string | null;
  notes: string | null;
};

export default function Calendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  async function loadEvents() {
    const { data } = await supabase
      .from("calendar_events")
      .select("id, title, event_date, event_time, notes")
      .order("event_date", { ascending: true })
      .order("event_time", { ascending: true });

    setEvents(data ?? []);
  }

  async function createEvent() {
    if (!title.trim() || !date) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("calendar_events")
      .insert({
        title,
        event_date: date,
        event_time: time || null,
        notes,
        user_id: user.id,
      })
      .select()
      .single();

    if (!data) return;

    setEvents((prev) => [...prev, data]);
    setTitle("");
    setDate("");
    setTime("");
    setNotes("");
  }

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <div>
      <p style={{ opacity: 0.7, marginBottom: 12 }}>
        Events, deadlines, plans.
      </p>

      {/* Add event */}
      <div style={{ marginBottom: 16 }}>
        <input
          placeholder="Event title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={{ marginLeft: 6 }}
        />

        <br />

        <textarea
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
        />

        <br />

        <button onClick={createEvent}>Add event</button>
      </div>

      {/* Event list */}
      <ul>
        {events.map((event) => (
          <li key={event.id} style={{ marginBottom: 12 }}>
            <strong>{event.title}</strong>
            <div style={{ opacity: 0.7 }}>
              {event.event_date}
              {event.event_time && ` • ${event.event_time}`}
            </div>
            {event.notes && <p>{event.notes}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
