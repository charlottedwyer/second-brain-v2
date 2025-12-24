import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Medication = {
  id: number;
  name: string;
};

type Schedule = {
  id: number;
  medication_id: number;
  time: string; // HH:MM
};

type Log = {
  medication_id: number;
  time: string;
};

export default function Medications() {
  const today = new Date().toISOString().split("T")[0];

  const [medications, setMedications] = useState<Medication[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    const { data: meds } = await supabase
      .from("medications")
      .select("*")
      .order("name");

    const { data: sched } = await supabase
      .from("medication_schedules")
      .select("*");

    const { data: logged } = await supabase
      .from("medication_logs")
      .select("medication_id, time")
      .eq("date", today);

    if (meds) setMedications(meds);
    if (sched) setSchedules(sched);
    if (logged) setLogs(logged);
  }

  async function addMedication() {
    if (!newName) return;

    await supabase.from("medications").insert([
      {
        name: newName,
      },
    ]);

    setNewName("");
    fetchAll();
  }

  async function markTaken(medication_id: number, time: string) {
    await supabase.from("medication_logs").insert([
      {
        medication_id,
        time,
        date: today,
        taken_at: new Date().toISOString(),
      },
    ]);

    fetchAll();
  }

  function isTaken(medication_id: number, time: string) {
    return logs.some(
      (l) => l.medication_id === medication_id && l.time === time
    );
  }

  return (
    <div>
      <h2>Medications — Today</h2>

      {/* ADD MED */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          placeholder="Medication name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button onClick={addMedication}>Add</button>
      </div>

      {/* TODAY LIST */}
      {medications.map((med) => {
        const medSchedules = schedules.filter(
          (s) => s.medication_id === med.id
        );

        if (medSchedules.length === 0) return null;

        return (
          <div
            key={med.id}
            style={{
              border: "1px solid var(--border)",
              borderRadius: 10,
              padding: 12,
              marginBottom: 12,
            }}
          >
            <strong>{med.name}</strong>

            <div style={{ marginTop: 8 }}>
              {medSchedules.map((s) => {
                const taken = isTaken(med.id, s.time);

                return (
                  <div
                    key={s.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 6,
                    }}
                  >
                    <span>{s.time}</span>

                    <button
                      disabled={taken}
                      onClick={() => markTaken(med.id, s.time)}
                      style={{
                        opacity: taken ? 0.5 : 1,
                      }}
                    >
                      {taken ? "Taken" : "Mark taken"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
