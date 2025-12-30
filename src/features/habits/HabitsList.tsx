import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

type Habit = {
  id: string;
  title: string;
  completed: boolean;
};

export default function HabitsList() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHabits();
  }, []);

  async function fetchHabits() {
    const { data, error } = await supabase
      .from("habits")
      .select("id, title, completed")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Failed to load habits:", error);
      return;
    }

    setHabits(data || []);
  }

  async function addHabit() {
    if (!newTitle.trim() || loading) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("habits")
      .insert([{ title: newTitle.trim() }])
      .select()
      .single();

    setLoading(false);

    if (error) {
      console.error("Failed to add habit:", error);
      return;
    }

    if (data) {
      setHabits((prev) => [...prev, data]);
      setNewTitle("");
    }
  }

  async function toggleHabit(habit: Habit) {
    const { error } = await supabase
      .from("habits")
      .update({ completed: !habit.completed })
      .eq("id", habit.id);

    if (error) {
      console.error("Failed to update habit:", error);
      return;
    }

    setHabits((prev) =>
      prev.map((h) =>
        h.id === habit.id
          ? { ...h, completed: !h.completed }
          : h
      )
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* LIST */}
      {habits.length === 0 && (
        <p style={{ opacity: 0.6 }}>
          No habits yet. Start with something small.
        </p>
      )}

      {habits.map((habit) => (
        <label
          key={habit.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={habit.completed}
            onChange={() => toggleHabit(habit)}
          />
          <span
            style={{
              textDecoration: habit.completed
                ? "line-through"
                : "none",
              opacity: habit.completed ? 0.6 : 1,
            }}
          >
            {habit.title}
          </span>
        </label>
      ))}

      {/* ADD */}
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <input
          placeholder="New habit"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <button onClick={addHabit} disabled={loading}>
          Add
        </button>
      </div>
    </div>
  );
}
