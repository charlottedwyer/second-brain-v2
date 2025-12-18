import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type WikiPage = {
  id: string;
  title: string;
  content: string;
};

export default function Wiki() {
  const [pages, setPages] = useState<WikiPage[]>([]);
  const [selected, setSelected] = useState<WikiPage | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editing, setEditing] = useState(false);

  async function loadPages() {
    const { data, error } = await supabase
      .from("wiki_pages")
      .select("id, title, content")
      .order("created_at", { ascending: false });

    if (error) return;
    setPages(data ?? []);
  }

  async function createPage() {
    if (!title.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("wiki_pages")
      .insert({
        title,
        content,
        user_id: user.id,
      })
      .select("id, title, content")
      .single();

    if (error || !data) return;

    setPages((prev) => [data, ...prev]);
    setTitle("");
    setContent("");
  }

  function openPage(page: WikiPage) {
    setSelected(page);
    setTitle(page.title);
    setContent(page.content);
    setEditing(false);
  }

  async function saveEdit() {
    if (!selected) return;

    const { data, error } = await supabase
      .from("wiki_pages")
      .update({ title, content })
      .eq("id", selected.id)
      .select("id, title, content")
      .single();

    if (error || !data) return;

    setPages((prev) =>
      prev.map((p) => (p.id === data.id ? data : p))
    );

    setSelected(data);
    setEditing(false);
  }

  async function deletePage() {
    if (!selected) return;

    await supabase.from("wiki_pages").delete().eq("id", selected.id);

    setPages((prev) => prev.filter((p) => p.id !== selected.id));
    setSelected(null);
    setTitle("");
    setContent("");
    setEditing(false);
  }

  useEffect(() => {
    loadPages();
  }, []);

  /* ======================
     VIEW MODE
     ====================== */

  if (selected && !editing) {
    return (
      <div>
        <button onClick={() => setSelected(null)}>← Back</button>

        <h3 style={{ marginTop: 12 }}>{selected.title}</h3>

        <p style={{ whiteSpace: "pre-wrap" }}>
          {selected.content}
        </p>

        <div style={{ marginTop: 16 }}>
          <button onClick={() => setEditing(true)}>Edit</button>
          <button onClick={deletePage} style={{ marginLeft: 8 }}>
            Delete
          </button>
        </div>
      </div>
    );
  }

  /* ======================
     EDIT MODE
     ====================== */

  if (selected && editing) {
    return (
      <div>
        <button onClick={() => setEditing(false)}>← Cancel</button>

        <div style={{ marginTop: 12 }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <br />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
          />

          <br />

          <button onClick={saveEdit}>Save</button>
        </div>
      </div>
    );
  }

  /* ======================
     LIST + CREATE
     ====================== */

  return (
    <div>
      <p style={{ opacity: 0.7, marginBottom: 12 }}>
        Long-form thinking, worldbuilding, references.
      </p>

      <div style={{ marginBottom: 16 }}>
        <input
          placeholder="Page title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <br />

        <textarea
          placeholder="Write your page…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
        />

        <br />

        <button onClick={createPage}>Create page</button>
      </div>

      <ul>
        {pages.map((page) => (
          <li key={page.id}>
            <button onClick={() => openPage(page)}>
              {page.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
