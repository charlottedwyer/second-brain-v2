import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Note = {
  id: string;
  title: string;
  content: string;
  notebook_id: string | null;
  archived: boolean;
};

type Tag = {
  id: string;
  name: string;
};

export default function Notes({
  notebookId,
}: {
  notebookId: string | null;
}) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteTags, setNoteTags] = useState<Record<string, Tag[]>>({});
  const [filterTag, setFilterTag] = useState<Tag | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showArchive, setShowArchive] = useState(false);

  async function loadNotes() {
    let query = supabase
      .from("notes")
      .select("id, title, content, notebook_id, archived")
      .eq("archived", showArchive)
      .order("created_at", { ascending: false });

    if (!showArchive && notebookId) {
      query = query.eq("notebook_id", notebookId);
    }

    const { data } = await query;
    const notesData = data ?? [];
    setNotes(notesData);

    if (notesData.length === 0) {
      setNoteTags({});
      return;
    }

    const ids = notesData.map((n) => n.id);

    const { data: joins } = await supabase
      .from("note_tags")
      .select("note_id, tags(id, name)")
      .in("note_id", ids);

    const map: Record<string, Tag[]> = {};
    joins?.forEach((j: any) => {
      if (!map[j.note_id]) map[j.note_id] = [];
      map[j.note_id].push(j.tags);
    });

    setNoteTags(map);
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

  async function addTag(noteId: string, name: string) {
    if (!name.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    let { data: tag } = await supabase
      .from("tags")
      .select("id, name")
      .eq("name", name)
      .single();

    if (!tag) {
      const res = await supabase
        .from("tags")
        .insert({ name, user_id: user.id })
        .select()
        .single();
      tag = res.data;
    }

    if (!tag) return;

    await supabase.from("note_tags").insert({
      note_id: noteId,
      tag_id: tag.id,
    });

    loadNotes();
  }

  async function removeTag(noteId: string, tagId: string) {
    await supabase
      .from("note_tags")
      .delete()
      .eq("note_id", noteId)
      .eq("tag_id", tagId);

    loadNotes();
  }

  async function archiveNote(id: string) {
    await supabase
      .from("notes")
      .update({ archived: true })
      .eq("id", id);

    loadNotes();
  }

  async function restoreNote(id: string) {
    await supabase
      .from("notes")
      .update({ archived: false })
      .eq("id", id);

    loadNotes();
  }

  useEffect(() => {
    loadNotes();
  }, [notebookId, showArchive, filterTag]);

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => setShowArchive(false)}>Notes</button>
        <button onClick={() => setShowArchive(true)} style={{ marginLeft: 6 }}>
          Archive
        </button>

        {filterTag && (
          <button
            onClick={() => setFilterTag(null)}
            style={{ marginLeft: 6 }}
          >
            Clear tag: #{filterTag.name}
          </button>
        )}
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
          <button onClick={createNote}>Add note</button>
        </div>
      )}

      <ul>
        {notes
          .filter((n) =>
            filterTag
              ? noteTags[n.id]?.some((t) => t.id === filterTag.id)
              : true
          )
          .map((note) => (
            <li key={note.id} style={{ marginBottom: 16 }}>
              <strong>{note.title}</strong>
              <p>{note.content}</p>

              {/* Tags */}
              <div style={{ marginBottom: 6 }}>
                {(noteTags[note.id] ?? []).map((t) => (
                  <span key={t.id} style={{ marginRight: 6 }}>
                    <button onClick={() => setFilterTag(t)}>
                      #{t.name}
                    </button>
                    <button
                      onClick={() => removeTag(note.id, t.id)}
                      style={{ marginLeft: 2 }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {!showArchive && (
                <>
                  <input
                    placeholder="Add tag"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addTag(note.id, e.currentTarget.value);
                        e.currentTarget.value = "";
                      }
                    }}
                  />

                  <div style={{ marginTop: 6 }}>
                    <button onClick={() => archiveNote(note.id)}>
                      Archive
                    </button>
                  </div>
                </>
              )}

              {showArchive && (
                <div style={{ marginTop: 6 }}>
                  <button onClick={() => restoreNote(note.id)}>
                    Restore
                  </button>
                </div>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
}
