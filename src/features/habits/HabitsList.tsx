import { useEffect, useState } from "react";

type Habit = {
  id: string;
  title: string;
  completed: boolean;
};

export default function HabitsList() {
  const [habits] = useState<Habit[]>([]);

  useEffect(() => {
    // Data loading will go here later
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
          }}
        >
          <input type="checkbox" checked={habit.completed} readOnly />
          <span>{habit.title}</span>
        </label>
      ))}
    </div>
  );
}
