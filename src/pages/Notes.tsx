import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import RichTextEditor from "../components/RichTextEditor";
import Notebooks from "./Notebooks";

type Note = {
  id: string;
  title: string;
  content: string;
  notebook_id: string | null;
  created_at: string;
};

type Props = {
  notebookId: string | null;
};

export default function Notes({ notebookId }: Props) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selected, setSelected] = useState<Note | null>(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetchNotes();
  }, [notebookId]);

  async function fetchNotes() {
    let q = supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false });

    if (notebookId) q = q.eq("notebook_id", notebookId);

    const { data } = await q;
    if (data) setNotes(data);
  }

  async function createNote() {
    const { data } = await supabase
      .from("notes")
      .insert([
        {
          title: "Untitled note",
          content: "",
          notebook_id: notebookId,
        },
      ])
      .select()
      .single();

    if (data) {
      setNotes([data, ...notes]);
      setSelected(data);
      setTitle(data.title);
      setContent("");
    }
  }

  async function saveNote() {
    if (!selected) return;

    await supabase
      .from("notes")
      .update({
        title,
        content,
      })
      .eq("id", selected.id);

    fetchNotes();
  }

  async function deleteNote(id: string) {
    const confirmDelete = confirm("Delete this note?");
    if (!confirmDelete) return;

    await supabase.from("notes").delete().eq("id", id);
    setSelected(null);
    fetchNotes();
  }

  return (
    <div className="page-container">
      {/* PAGE HEADER */}
      <header className="page-header">
        <div>
          <h1>Notes</h1>
          <p className="page-subtitle">
            Write, organise, and revisit your thoughts.
          </p>
        </div>

        <div className="page-actions">
          <button onClick={createNote}>New note</button>
        </div>
      </header>

      <div className="split-layout">
        {/* SIDEBAR */}
        <aside className={`split-list ${selected ? "mobile-hidden" : ""}`}>
          <Notebooks
            activeNotebook={notebookId}
            onSelect={() => {}}
          />

          {notes.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                setSelected(n);
                setTitle(n.title);
                setContent(n.content || "");
              }}
              style={{
                padding: 10,
                cursor: "pointer",
                borderRadius: 6,
                background:
                  selected?.id === n.id
                    ? "var(--border)"
                    : "transparent",
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
              <button onClick={() => setSelected(null)}>← Back</button>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  marginBottom: 12,
                }}
              />

              <RichTextEditor
                value={content}
                onChange={setContent}
              />

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginTop: 16,
                }}
              >
                <button onClick={saveNote}>Save</button>
                <button
                  onClick={() => deleteNote(selected.id)}
                >
                  Delete
                </button>
              </div>
            </>
          ) : (
            <p style={{ opacity: 0.6 }}>
              Select or create a note.
            </p>
          )}
        </main>
      </div>
    </div>
  );
}
