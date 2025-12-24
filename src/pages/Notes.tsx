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
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchNotes();
  }, [notebookId]);

  async function fetchNotes() {
    let query = supabase.from("notes").select("*").order("created_at", {
      ascending: false,
    });

    if (notebookId) {
      query = query.eq("notebook_id", notebookId);
    }

    const { data } = await query;
    if (data) setNotes(data);
  }

  async function createNote() {
    const { data } = await supabase
      .from("notes")
      .insert([{ title: "New Note", content: "" }])
      .select()
      .single();

    if (data) {
      setNotes([data, ...notes]);
      setSelectedNote(data);
      setContent("");
    }
  }

  async function saveNote() {
    if (!selectedNote) return;

    await supabase
      .from("notes")
      .update({ content })
      .eq("id", selectedNote.id);

    setNotes((prev) =>
      prev.map((n) =>
        n.id === selectedNote.id ? { ...n, content } : n
      )
    );
  }

  return (
    <div>
      <button onClick={createNote}>New Note</button>

      <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
        {/* LIST */}
        <div style={{ width: 220 }}>
          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => {
                setSelectedNote(note);
                setContent(note.content || "");
              }}
              style={{
                padding: 8,
                cursor: "pointer",
                borderRadius: 6,
                background:
                  selectedNote?.id === note.id
                    ? "var(--border)"
                    : "transparent",
              }}
            >
              <strong>{note.title}</strong>
            </div>
          ))}
        </div>

        {/* EDITOR */}
        <div style={{ flex: 1 }}>
          {selectedNote ? (
            <>
              <RichTextEditor value={content} onChange={setContent} />
              <button style={{ marginTop: 12 }} onClick={saveNote}>
                Save
              </button>
            </>
          ) : (
            <p style={{ opacity: 0.6 }}>Select a note to edit</p>
          )}
        </div>
      </div>
    </div>
  );
}
