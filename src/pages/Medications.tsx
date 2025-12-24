import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Medication = {
  id: string;
  name: string;
  dosage: string | null;
  times: string[];
};

type Log = {
  medication_id: string;
  time: string;
  status: "pending" | "taken" | "skipped";
};

export default function Medications() {
  const today = new Date().toISOString().split("T")[0];

  const [meds, setMeds] = useState<Medication[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: medsData } = await supabase
      .from("medications")
      .select("*");

    const { data: logsData } = await supabase
      .from("medication_logs")
      .select("*")
      .eq("date", today);

    setMeds(medsData || []);
    setLogs(logsData || []);
  }

  function getStatus(medId: string, time: string) {
    return (
      logs.find(
        (l) => l.medication_id === medId && l.time === time
      )?.status || "pending"
    );
  }

  async function mark(
    medId: string,
    time: string,
    status: "taken" | "skipped"
  ) {
    await supabase.from("medication_logs").upsert([
      {
        medication_id: medId,
        date: today,
        time,
        status,
      },
    ]);

    fetchData();
  }

  return (
    <div>
      {meds.map((m) => (
        <div key={m.id} className="card">
          <strong>{m.name}</strong>
          {m.dosage && <p>{m.dosage}</p>}

          {m.times.map((t) => {
            const status = getStatus(m.id, t);

            return (
              <div
                key={t}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 8,
                }}
              >
                <span style={{ width: 60 }}>{t}</span>

                {status === "pending" ? (
                  <>
                    <button
                      onClick={() => mark(m.id, t, "taken")}
                    >
                      Taken
                    </button>
                    <button
                      className="secondary"
                      onClick={() => mark(m.id, t, "skipped")}
                    >
                      Skipped
                    </button>
                  </>
                ) : (
                  <span
                    style={{
                      color:
                        status === "taken"
                          ? "green"
                          : "var(--muted)",
                    }}
                  >
                    {status === "taken"
                      ? "✓ Taken"
                      : "Skipped"}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
