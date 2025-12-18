import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Note = {
  id: string;
  title: string;
  content: string;
};

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    async function loadNotes() {
      const { data } = await supabase
  .from("notes")
  .select("*")
  .order("created_at", { ascending: false });

      setNotes(data ?? []);
    }

    loadNotes();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Notes</h1>

      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <strong>{note.title}</strong>
            <p>{note.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
