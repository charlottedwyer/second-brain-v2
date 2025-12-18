import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Note = {
  id: string;
  title: string;
  content: string;
};

export default function Notes({
  notebookId,
}: {
  notebookId: string | null;
}) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  async function loadNotes() {
    let query = supabase
      .from("notes")
      .select("id, title, content")
      .order("created_at", { ascending: false });

    if (notebookId) {
      query = query.eq("notebook_id", notebookId);
    }

    const { data } = await query;
    setNotes(data ?? []);
  }

  async function createNote() {
    if (!title.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("notes")
      .insert({
        title,
        content,
        user_id: user.id,
        notebook_id: notebookId,
      })
      .select("id, title, content")
      .single();

    if (!data) return;

    setNotes((prev) => [data, ...prev]);
    setTitle("");
    setContent("");
  }

  function startEdit(note: Note) {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
  }

  async function saveEdit() {
    if (!editingId) return;

    const { data } = await supabase
      .from("notes")
      .update({ title, content })
      .eq("id", editingId)
      .select("id, title, content")
      .single();

    if (!data) return;

    setNotes((prev) =>
      prev.map((n) => (n.id === editingId ? data : n))
    );

    setEditingId(null);
    setTitle("");
    setContent("");
  }

  async function deleteNote(id: string) {
    await supabase.from("notes").delete().eq("id", id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  useEffect(() => {
    loadNotes();
  }, [notebookId]);

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
          rows={3}
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
              style={{ marginLeft: 6 }}
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

            <button onClick={() => startEdit(note)}>
              Edit
            </button>
            <button
              onClick={() => deleteNote(note.id)}
              style={{ marginLeft: 6 }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
