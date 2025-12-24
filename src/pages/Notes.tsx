import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import RichTextEditor from "../components/RichTextEditor";

type Note = {
  id: number;
  title: string;
  content: string;
  created_at: string;
};

type Props = {
  notebookId: string | null;
};

export default function Notes({ notebookId }: Props) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selected, setSelected] = useState<Note | null>(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, [notebookId]);

  async function fetchNotes() {
    setLoading(true);

    let q = supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false });

    if (notebookId) q = q.eq("notebook_id", notebookId);

    const { data } = await q;
    if (data) setNotes(data);

    setLoading(false);
  }

  async function createNote() {
    const { data } = await supabase
      .from("notes")
      .insert([{ title: "Untitled note", content: "" }])
      .select()
      .single();

    if (data) {
      setNotes([data, ...notes]);
      setSelected(data);
      setContent("");
    }
  }

  async function save() {
    if (!selected) return;

    await supabase
      .from("notes")
      .update({ content })
      .eq("id", selected.id);
  }

  return (
    <div className="page-container">
      {/* PAGE HEADER */}
      <header className="page-header">
        <div>
          <h1>Notes</h1>
          <p className="page-subtitle">
            Write, think, plan — everything in one place.
          </p>
        </div>

        <div className="page-actions">
          <button onClick={createNote}>New note</button>
        </div>
      </header>

      {/* CONTENT */}
      <div className="split-layout">
        {/* LIST */}
        <aside className={`split-list ${selected ? "mobile-hidden" : ""}`}>
          {loading && <p>Loading…</p>}

          {notes.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                setSelected(n);
                setContent(n.content || "");
              }}
              style={{
                padding: 12,
                borderRadius: 8,
                cursor: "pointer",
                background:
                  selected?.id === n.id
                    ? "var(--border)"
                    : "transparent",
                marginBottom: 4,
              }}
            >
              <strong>{n.title}</strong>
            </div>
          ))}
        </aside>

        {/* EDITOR */}
        <main className={`split-editor ${!selected ? "mobile-hidden" : ""}`}>
          {selected ? (
            <>
              {/* MOBILE BACK */}
              <button
                onClick={() => setSelected(null)}
                style={{ marginBottom: 12 }}
              >
                ← Back
              </button>

              <RichTextEditor value={content} onChange={setContent} />

              <div style={{ marginTop: 16 }}>
                <button onClick={save}>Save</button>
              </div>
            </>
          ) : (
            <p style={{ opacity: 0.6 }}>
              Select a note to start editing.
            </p>
          )}
        </main>
      </div>
    </div>
  );
}
