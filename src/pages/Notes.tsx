import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Note = {
  id: string;
  title: string;
  content: string;
  notebook_id: string | null;
  archived: boolean;
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
  const [showArchive, setShowArchive] = useState(false);

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
      .select(
        "id, title, content, notebook_id, archived"
      )
      .eq("archived", showArchive)
      .order("created_at", { ascending: false });

    if (!showArchive && notebookId) {
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

  async function archiveNote(id: string) {
    const { data } = await supabase
      .from("notes")
      .update({ archived: true })
      .eq("id", id)
      .select()
      .single();

    if (!data) return;
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  async function restoreNote(id: string) {
    const { data } = await supabase
      .from("notes")
      .update({ archived: false })
      .eq("id", id)
      .select()
      .single();

    if (!data) return;
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  async function deleteForever(id: string) {
    await supabase.from("notes").delete().eq("id", id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  async function moveNote(noteId: string, newNotebookId: string | null) {
    const { data } = await supabase
      .from("notes")
      .update({ notebook_id: newNotebookId })
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
  }, [notebookId, showArchive]);

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => setShowArchive(false)}>
          Notes
        </button>
        <button
          onClick={() => setShowArchive(true)}
          style={{ marginLeft: 6 }}
        >
          Archive
        </button>
      </div>

      {!showArchive && (
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
      )}

      <ul>
        {notes.map((note) => (
          <li key={note.id} style={{ marginBottom: 14 }}>
            <strong>{note.title}</strong>
            <p>{note.content}</p>

            {!showArchive && (
              <>
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
                  <button onClick={() => startEdit(note)}>
                    Edit
                  </button>
                  <button
                    onClick={() => archiveNote(note.id)}
                    style={{ marginLeft: 6 }}
                  >
                    Archive
                  </button>
                </div>
              </>
            )}

            {showArchive && (
              <div style={{ marginTop: 6 }}>
                <button
                  onClick={() => restoreNote(note.id)}
                >
                  Restore
                </button>
                <button
                  onClick={() => deleteForever(note.id)}
                  style={{ marginLeft: 6 }}
                >
                  Delete forever
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
