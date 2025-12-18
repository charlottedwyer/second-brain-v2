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

  useEffect(() => {
    loadPages();
  }, []);

  if (selected) {
    return (
      <div>
        <button onClick={() => setSelected(null)}>← Back</button>

        <h3 style={{ marginTop: 12 }}>{selected.title}</h3>
        <p style={{ whiteSpace: "pre-wrap" }}>{selected.content}</p>
      </div>
    );
  }

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
            <button onClick={() => setSelected(page)}>
              {page.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
