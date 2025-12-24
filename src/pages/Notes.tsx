import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import RichTextEditor from "../components/RichTextEditor";

type Note = {
  id: number;
  title: string;
  content: string;
};

type Props = {
  notebookId: string | null;
};

export default function Notes({ notebookId }: Props) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selected, setSelected] = useState<Note | null>(null);
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchNotes();
  }, [notebookId]);

  async function fetchNotes() {
    let q = supabase.from("notes").select("*").order("created_at", {
      ascending: false,
    });

    if (notebookId) q = q.eq("notebook_id", notebookId);

    const { data } = await q;
    if (data) setNotes(data);
  }

  async function save() {
    if (!selected) return;
    await supabase.from("notes").update({ content }).eq("id", selected.id);
  }

  return (
    <div>
      <button onClick={() => setSelected(null)}>New Note</button>

      <div className="split-layout">
        {/* LIST */}
        <div className={`split-list ${selected ? "mobile-hidden" : ""}`}>
          {notes.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                setSelected(n);
                setContent(n.content || "");
              }}
              style={{ padding: 10, cursor: "pointer" }}
            >
              <strong>{n.title}</strong>
            </div>
          ))}
        </div>

        {/* EDITOR */}
        <div className={`split-editor ${!selected ? "mobile-hidden" : ""}`}>
          {selected && (
            <>
              <button onClick={() => setSelected(null)}>← Back</button>
              <RichTextEditor value={content} onChange={setContent} />
              <button onClick={save}>Save</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
