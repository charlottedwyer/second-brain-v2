import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function MedicationsSetup() {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [times, setTimes] = useState<string[]>(["08:00"]);

  async function addMedication() {
    if (!name.trim()) return;

    await supabase.from("medications").insert([
      {
        name,
        dosage,
        times,
      },
    ]);

    setName("");
    setDosage("");
    setTimes(["08:00"]);
    alert("Medication added");
  }

  function updateTime(index: number, value: string) {
    setTimes((t) => t.map((x, i) => (i === index ? value : x)));
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Add medication</h1>
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
            onClick={() => setTimes([...times, "12:00"])}
          >
            Add time
          </button>

          <button onClick={addMedication}>Save medication</button>
        </div>
      </div>
    </div>
  );
}
