import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import RichTextEditor from "../components/RichTextEditor";

type WikiPageType =
  | "Concept"
  | "Lore"
  | "System"
  | "Reference"
  | "Personal";

type WikiPage = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  type: WikiPageType;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
};

export default function Wiki() {
  const [pages, setPages] = useState<WikiPage[]>([]);
  const [selected, setSelected] = useState<WikiPage | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<WikiPageType>("Concept");
  const [parentId, setParentId] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  /* ----------------------------- DATA LOAD ----------------------------- */

  async function loadPages() {
    const { data, error } = await supabase
      .from("wiki_pages")
      .select("*")
      .order("title");

    if (!error && data) setPages(data as WikiPage[]);
  }

  useEffect(() => {
    loadPages();
  }, []);

  /* ----------------------------- SELECTION ------------------------------ */

  function selectPage(page: WikiPage) {
    setSelected(page);
    setTitle(page.title);
    setContent(page.content);
    setType(page.type);
    setParentId(page.parent_id);
  }

  function resetEditor() {
    setSelected(null);
    setTitle("");
    setContent("");
    setType("Concept");
    setParentId(null);
  }

  /* ------------------------------- SAVE -------------------------------- */

  async function savePage() {
    if (!title.trim()) return;

    if (selected) {
      await supabase
        .from("wiki_pages")
        .update({
          title,
          content,
          type,
          parent_id: parentId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selected.id);
    } else {
      await supabase.from("wiki_pages").insert({
        title,
        content,
        type,
        parent_id: parentId,
      });
    }

    await loadPages();
    resetEditor();
  }

  /* ------------------------------ DELETE ------------------------------- */

  async function deletePage() {
    if (!selected) return;
    if (!confirm(`Delete "${selected.title}"?`)) return;

    await supabase.from("wiki_pages").delete().eq("id", selected.id);
    await loadPages();
    resetEditor();
  }

  /* ----------------------------- TREE LOGIC ----------------------------- */

  const filteredPages = useMemo(() => {
    if (!search.trim()) return pages;
    const q = search.toLowerCase();
    return pages.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q)
    );
  }, [pages, search]);

  function renderTree(parent: string | null, depth = 0) {
    return filteredPages
      .filter((p) => p.parent_id === parent)
      .map((page) => (
        <div key={page.id} style={{ marginLeft: depth * 12 }}>
          <button
            onClick={() => selectPage(page)}
            style={{
              display: "block",
              textAlign: "left",
              width: "100%",
              padding: "4px 6px",
              borderRadius: 4,
              background:
                selected?.id === page.id ? "rgba(160,120,255,0.15)" : "none",
            }}
          >
            {page.title}
          </button>
          {renderTree(page.id, depth + 1)}
        </div>
      ));
  }

  /* --------------------------- BREADCRUMBS ----------------------------- */

  const breadcrumbs = useMemo(() => {
    if (!selected) return [];
    const trail: WikiPage[] = [];
    let current: WikiPage | undefined = selected;

    while (current) {
      trail.unshift(current);
      current = pages.find((p) => p.id === current!.parent_id);
    }

    return trail;
  }, [selected, pages]);

  /* ------------------------------- UI ---------------------------------- */

  return (
    <div style={{ display: "flex", height: "100%" }}>
      {/* SIDEBAR */}
      <aside style={{ width: 260, padding: 12, borderRight: "1px solid #ddd" }}>
        <input
          placeholder="Search wiki…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%", marginBottom: 8 }}
        />

        <button onClick={resetEditor} style={{ marginBottom: 12 }}>
          + New Page
        </button>

        <div>{renderTree(null)}</div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, padding: 16 }}>
        {selected && breadcrumbs.length > 0 && (
          <div style={{ marginBottom: 8, opacity: 0.7 }}>
            {breadcrumbs.map((b, i) => (
              <span key={b.id}>
                {i > 0 && " › "}
                {b.title}
              </span>
            ))}
          </div>
        )}

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", fontSize: 18, marginBottom: 8 }}
        />

        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as WikiPageType)}
          >
            <option>Concept</option>
            <option>Lore</option>
            <option>System</option>
            <option>Reference</option>
            <option>Personal</option>
          </select>

          <select
            value={parentId ?? ""}
            onChange={(e) =>
              setParentId(e.target.value || null)
            }
          >
            <option value="">No parent</option>
            {pages
              .filter((p) => p.id !== selected?.id)
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
          </select>
        </div>

        <RichTextEditor value={content} onChange={setContent} />

        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <button onClick={savePage}>Save</button>
          {selected && <button onClick={deletePage}>Delete</button>}
        </div>
      </main>
    </div>
  );
}
