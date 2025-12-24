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
  const [selectedPage, setSelectedPage] = useState<WikiPage | null>(null);
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchPages();
  }, []);

  async function fetchPages() {
    const { data } = await supabase
      .from("wiki_pages")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setPages(data);
  }

  async function createPage() {
    const { data } = await supabase
      .from("wiki_pages")
      .insert([{ title: "New Page", content: "" }])
      .select()
      .single();

    if (data) {
      setPages([data, ...pages]);
      setSelectedPage(data);
      setContent("");
    }
  }

  async function savePage() {
    if (!selectedPage) return;

    await supabase
      .from("wiki_pages")
      .update({ content })
      .eq("id", selectedPage.id);

    setPages((prev) =>
      prev.map((p) =>
        p.id === selectedPage.id ? { ...p, content } : p
      )
    );
  }

  return (
    <div>
      <button onClick={createPage}>New Page</button>

      <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
        {/* PAGE LIST */}
        <div style={{ width: 220 }}>
          {pages.map((page) => (
            <div
              key={page.id}
              onClick={() => {
                setSelectedPage(page);
                setContent(page.content || "");
              }}
              style={{
                padding: 8,
                cursor: "pointer",
                borderRadius: 6,
                background:
                  selectedPage?.id === page.id
                    ? "var(--border)"
                    : "transparent",
              }}
            >
              <strong>{page.title}</strong>
            </div>
          ))}
        </div>

        {/* EDITOR */}
        <div style={{ flex: 1 }}>
          {selectedPage ? (
            <>
              <RichTextEditor value={content} onChange={setContent} />
              <button style={{ marginTop: 12 }} onClick={savePage}>
                Save
              </button>
            </>
          ) : (
            <p style={{ opacity: 0.6 }}>Select a page to edit</p>
          )}
        </div>
      </div>
    </div>
  );
}
