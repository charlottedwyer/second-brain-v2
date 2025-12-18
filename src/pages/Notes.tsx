import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Note = {
  id: string;
  title: string;
  content: string;
  notebook_id: string | null;
};

type Notebook = {
  id: string;
  name: string;
};

export default function Notes({
  notebookId,
}: {
  notebookId: string | null;
}) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  async function loadNotebooks() {
    const { data } = await supabase
      .from("notebooks")
      .select("id, name")
      .order("created_at", { ascending: true });

    setNotebooks(data ?? []);
  }

  async function loadNotes() {
    let query = supabase
      .from("notes")
      .select("id, title, content, notebook_id")
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
      .select()
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
      .select()
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

  async function moveNote(noteId: string, newNotebookId: string | null) {
    const { data } = await supabase
      .from("notes")
      .update({
        notebook_id: newNotebookId || null,
      })
      .eq("id", noteId)
      .select()
      .single();

    if (!data) return;

    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? data : n))
    );
  }

  useEffect(() => {
    loadNotebooks();
    loadNotes();
  }, [notebookId]);

  return (
    <div>
      {/* Create / Edit */}
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

      {/* Notes list */}
      <ul>
        {notes.map((note) => (
          <li key={note.id} style={{ marginBottom: 14 }}>
            <strong>{note.title}</strong>
            <p>{note.content}</p>

            <select
              value={note.notebook_id ?? ""}
              onChange={(e) =>
                moveNote(
                  note.id,
                  e.target.value || null
                )
              }
            >
              <option value="">All notes</option>
              {notebooks.map((nb) => (
                <option key={nb.id} value={nb.id}>
                  {nb.name}
                </option>
              ))}
            </select>

            <div style={{ marginTop: 6 }}>
              <button onClick={() => startEdit(note)}>Edit</button>
              <button
                onClick={() => deleteNote(note.id)}
                style={{ marginLeft: 6 }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
