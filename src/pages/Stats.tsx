import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Stats() {
  const [notesCount, setNotesCount] = useState(0);
  const [writingDays, setWritingDays] = useState(0);
  const [habitTicks, setHabitTicks] = useState(0);
  const [mediaFinished, setMediaFinished] = useState(0);

  const { start, end } = useMemo(() => {
    const now = new Date();
    const day = now.getDay(); // 0 = Sun
    const diff = day === 0 ? -6 : 1 - day; // Monday start
    const monday = new Date(now);
    monday.setDate(now.getDate() + diff);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    return {
      start: monday.toISOString(),
      end: sunday.toISOString(),
    };
  }, []);

  async function loadStats() {
    // Notes
    const { data: notes } = await supabase
      .from("notes")
      .select("created_at")
      .gte("created_at", start)
      .lte("created_at", end);

    const notesData = notes ?? [];
    setNotesCount(notesData.length);

    const uniqueDays = new Set(
      notesData.map((n) => n.created_at.slice(0, 10))
    );
    setWritingDays(uniqueDays.size);

    // Habit ticks
    const { data: habits } = await supabase
      .from("habit_logs")
      .select("id")
      .gte("created_at", start)
      .lte("created_at", end);

    setHabitTicks(habits?.length ?? 0);

    // Media finished
    const { data: media } = await supabase
      .from("media")
      .select("id")
      .in("status", ["read", "watched"])
      .gte("updated_at", start)
      .lte("updated_at", end);

    setMediaFinished(media?.length ?? 0);
  }

  useEffect(() => {
    loadStats();
  }, [start, end]);

  return (
    <div>
      <p style={{ opacity: 0.7, marginBottom: 12 }}>
        This week at a glance.
      </p>

      <ul>
        <li>📝 Notes created: {notesCount}</li>
        <li>📆 Days you wrote: {writingDays}</li>
        <li>🔁 Habits completed: {habitTicks}</li>
        <li>📚 Media finished: {mediaFinished}</li>
      </ul>
    </div>
  );
}
