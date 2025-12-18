import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const PROMPTS = [
  "What stayed with me today?",
  "What challenged me today?",
  "What did I avoid today?",
  "What am I grateful for right now?",
  "What do I need more of?",
];

export default function Reflection() {
  const [journalId, setJournalId] = useState<string | null>(null);

  async function ensureJournal() {
    const { data: existing } = await supabase
      .from("notebooks")
      .select("id")
      .eq("name", "Journal")
      .single();

    if (existing) {
      setJournalId(existing.id);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: created } = await supabase
      .from("notebooks")
      .insert({
        name: "Journal",
        user_id: user.id,
      })
      .select("id")
      .single();

    if (created) setJournalId(created.id);
  }

  async function createReflection(prompt: string) {
    if (!journalId) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("notes").insert({
      title: prompt,
      content: `${prompt}\n\n`,
      user_id: user.id,
      notebook_id: journalId,
    });
  }

  useEffect(() => {
    ensureJournal();
  }, []);

  return (
    <div>
      <p style={{ opacity: 0.7, marginBottom: 12 }}>
        Gentle prompts for reflection.
      </p>

      <ul>
        {PROMPTS.map((p) => (
          <li key={p} style={{ marginBottom: 6 }}>
            <button onClick={() => createReflection(p)}>
              {p}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
