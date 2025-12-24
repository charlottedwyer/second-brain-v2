import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import RichTextEditor from "../components/RichTextEditor";

type WikiPage = {
  id: number;
  title: string;
  content: string;
  created_at: string;
};

export default function Wiki() {
  const [pages, setPages] = useState<WikiPage[]>([]);
  const [selected, setSelected] = useState<WikiPage | null>(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPages();
  }, []);

  async function fetchPages() {
    setLoading(true);

    const { data } = await supabase
      .from("wiki_pages")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setPages(data);
    setLoading(false);
  }

  async function createPage() {
    const { data } = await supabase
      .from("wiki_pages")
      .insert([{ title: "Untitled page", content: "" }])
      .select()
      .single();

    if (data) {
      setPages([data, ...pages]);
      setSelected(data);
      setContent("");
    }
  }

  async function save() {
    if (!selected) return;

    await supabase
      .from("wiki_pages")
      .update({ content })
      .eq("id", selected.id);
  }

  return (
    <div className="page-container">
      {/* PAGE HEADER */}
      <header className="page-header">
        <div>
          <h1>Wiki</h1>
          <p className="page-subtitle">
            Your personal knowledge base — ideas, worlds, systems, lore.
          </p>
        </div>

        <div className="page-actions">
          <button onClick={createPage}>New page</button>
        </div>
      </header>

      {/* CONTENT */}
      <div className="split-layout">
        {/* PAGE LIST */}
        <aside className={`split-list ${selected ? "mobile-hidden" : ""}`}>
          {loading && <p>Loading…</p>}

          {pages.map((p) => (
            <div
              key={p.id}
              onClick={() => {
                setSelected(p);
                setContent(p.content || "");
              }}
              style={{
                padding: 12,
                borderRadius: 8,
                cursor: "pointer",
                background:
                  selected?.id === p.id
                    ? "var(--border)"
                    : "transparent",
                marginBottom: 4,
              }}
            >
              <strong>{p.title}</strong>
            </div>
          ))}
        </aside>

        {/* EDITOR */}
        <main className={`split-editor ${!selected ? "mobile-hidden" : ""}`}>
          {selected ? (
            <>
              {/* MOBILE BACK */}
              <button
                onClick={() => setSelected(null)}
                style={{ marginBottom: 12 }}
              >
                ← Back
              </button>

              <RichTextEditor value={content} onChange={setContent} />

              <div style={{ marginTop: 16 }}>
                <button onClick={save}>Save</button>
              </div>
            </>
          ) : (
            <p style={{ opacity: 0.6 }}>
              Select a page to view or edit.
            </p>
          )}
        </main>
      </div>
    </div>
  );
}
