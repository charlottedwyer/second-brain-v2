import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import RichTextEditor from "../components/RichTextEditor";

type Props = {
  notebook: { id: string; name: string };
  onBack: () => void;
};

type Note = {
  id: string;
  title: string;
  content: string;
};

export default function NotesInNotebook({ notebook, onBack }: Props) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selected, setSelected] = useState<Note | null>(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetchNotes();
  }, [notebook.id]);

  async function fetchNotes() {
    const { data } = await supabase
      .from("notes")
      .select("*")
      .eq("notebook_id", notebook.id)
      .order("created_at", { ascending: false });

    if (data) setNotes(data);
  }

  async function createNote() {
    const { data } = await supabase
      .from("notes")
      .insert([
        {
          title: "Untitled note",
          content: "",
          notebook_id: notebook.id,
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
      .update({ title, content })
      .eq("id", selected.id);

    fetchNotes();
  }

  async function deleteNote(id: string) {
    if (!confirm("Delete this note?")) return;

    await supabase.from("notes").delete().eq("id", id);
    setSelected(null);
    fetchNotes();
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <button onClick={onBack}>← Notebooks</button>
        <h1>{notebook.name}</h1>
        <button onClick={createNote}>New note</button>
      </header>

      <div className="split-layout">
        <aside className={`split-list ${selected ? "mobile-hidden" : ""}`}>
          {notes.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                setSelected(n);
                setTitle(n.title);
                setContent(n.content || "");
              }}
              className="note-list-item"
            >
              <strong>{n.title}</strong>
            </div>
          ))}
        </aside>

        <main className={`split-editor ${!selected ? "mobile-hidden" : ""}`}>
          {selected ? (
            <>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <RichTextEditor value={content} onChange={setContent} />
              <div style={{ marginTop: 12 }}>
                <button onClick={saveNote}>Save</button>
                <button onClick={() => deleteNote(selected.id)}>
                  Delete
                </button>
              </div>
            </>
          ) : (
            <p>Select a note</p>
          )}
        </main>
      </div>
    </div>
  );
}
