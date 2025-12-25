import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function MedicationsSetup() {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [times, setTimes] = useState<string[]>(["08:00"]);
  const [loading, setLoading] = useState(false);

  async function addMedication() {
    if (!name.trim()) return;

    setLoading(true);

    const { error } = await supabase.from("medications").insert([
      {
        name,
        dosage,
        times,
      },
    ]);

    setLoading(false);

    if (error) {
      console.error("Medication insert failed:", error);
      alert(error.message);
      return;
    }

    setName("");
    setDosage("");
    setTimes(["08:00"]);
    alert("Medication added");
  }

  function updateTime(index: number, value: string) {
    setTimes((prev) =>
      prev.map((t, i) => (i === index ? value : t))
    );
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1>Add medication</h1>
          <p className="page-subtitle">
            Set up medications once, then track them daily.
          </p>
        </div>
      </header>

      <div className="card">
        <div className="card-body">
          <input
            placeholder="Medication name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Dosage (e.g. 50 mg)"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
          />

          <h3>Times</h3>

          {times.map((t, i) => (
            <input
              key={i}
              type="time"
              value={t}
              onChange={(e) => updateTime(i, e.target.value)}
            />
          ))}

          <button
            className="secondary"
            onClick={() => setTimes((t) => [...t, "12:00"])}
          >
            Add another time
          </button>

          <button onClick={addMedication} disabled={loading}>
            {loading ? "Saving…" : "Save medication"}
          </button>
        </div>
      </div>
    </div>
  );
}
