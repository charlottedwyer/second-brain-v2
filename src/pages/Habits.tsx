import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Habit = {
  id: string;
  name: string;
};

type HabitLog = {
  habit_id: string;
};

export default function Habits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [name, setName] = useState("");

  const today = new Date().toISOString().slice(0, 10);

  async function loadHabits() {
    const { data } = await supabase
      .from("habits")
      .select("id, name")
      .order("created_at", { ascending: true });

    setHabits(data ?? []);
  }

  async function loadLogs() {
    const { data } = await supabase
      .from("habit_logs")
      .select("habit_id")
      .eq("log_date", today);

    setLogs(data ?? []);
  }

  async function createHabit() {
    if (!name.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("habits")
      .insert({
        name,
        user_id: user.id,
      })
      .select()
      .single();

    if (!data) return;

    setHabits((prev) => [...prev, data]);
    setName("");
  }

  async function toggleHabit(habitId: string, done: boolean) {
    if (done) {
      await supabase
        .from("habit_logs")
        .delete()
        .eq("habit_id", habitId)
        .eq("log_date", today);
    } else {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from("habit_logs").insert({
        habit_id: habitId,
        log_date: today,
        user_id: user.id,
      });
    }

    loadLogs();
  }

  useEffect(() => {
    loadHabits();
    loadLogs();
  }, []);

  return (
    <div>
      <p style={{ opacity: 0.7, marginBottom: 12 }}>
        Daily habits — no streak pressure.
      </p>

      {/* Create habit */}
      <div style={{ marginBottom: 16 }}>
        <input
          placeholder="New habit"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={createHabit} style={{ marginLeft: 6 }}>
          Add
        </button>
      </div>

      {/* Habit list */}
      <ul>
        {habits.map((habit) => {
          const doneToday = logs.some(
            (l) => l.habit_id === habit.id
          );

          return (
            <li key={habit.id} style={{ marginBottom: 10 }}>
              <label>
                <input
                  type="checkbox"
                  checked={doneToday}
                  onChange={() =>
                    toggleHabit(habit.id, doneToday)
                  }
                />{" "}
                {habit.name}
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
