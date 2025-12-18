import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Note = {
  id: string;
  title: string;
  content: string;
};

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  async function loadNotes() {
    const { data } = await supabase
  .from("notes")
  .select("id, title, content")
  .order("created_at", { ascending: false });

    setNotes(data ?? []);
  }

  async function createNote() {
  if (!title.trim()) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data, error } = await supabase
    .from("notes")
    .insert({
      title,
      content,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    return;
  }

  setNotes((prev) => [data, ...prev]);
  setTitle("");
  setContent("");
}

  async function startEdit(note: Note) {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
  }

  async function saveEdit() {
    if (!editingId) return;

    await supabase
      .from("notes")
      .update({ title, content })
      .eq("id", editingId);

    setEditingId(null);
    setTitle("");
    setContent("");
    loadNotes();
  }

  async function deleteNote(id: string) {
    await supabase.from("notes").delete().eq("id", id);
    loadNotes();
  }

  useEffect(() => {
    loadNotes();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <input
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <textarea
          placeholder="Write something…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <br />

        {editingId ? (
          <>
            <button onClick={saveEdit}>Save</button>
            <button
              onClick={() => {
                setEditingId(null);
                setTitle("");
                setContent("");
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <button onClick={createNote}>Add note</button>
        )}
      </div>

      <ul>
        {notes.map((note) => (
          <li key={note.id} style={{ marginBottom: 12 }}>
            <strong>{note.title}</strong>
            <p>{note.content}</p>

            <button onClick={() => startEdit(note)}>Edit</button>
            <button onClick={() => deleteNote(note.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
