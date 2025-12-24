import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import RichTextEditor from "../components/RichTextEditor";

type Page = {
  id: number;
  title: string;
  content: string;
};

export default function Wiki() {
  const [pages, setPages] = useState<Page[]>([]);
  const [selected, setSelected] = useState<Page | null>(null);
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

  async function save() {
    if (!selected) return;
    await supabase
      .from("wiki_pages")
      .update({ content })
      .eq("id", selected.id);
  }

  return (
    <div>
      <button onClick={() => setSelected(null)}>New Page</button>

      <div className="split-layout">
        {/* LIST */}
        <div className={`split-list ${selected ? "mobile-hidden" : ""}`}>
          {pages.map((p) => (
            <div
              key={p.id}
              onClick={() => {
                setSelected(p);
                setContent(p.content || "");
              }}
              style={{ padding: 10, cursor: "pointer" }}
            >
              <strong>{p.title}</strong>
            </div>
          ))}
        </div>

        {/* EDITOR */}
        <div className={`split-editor ${!selected ? "mobile-hidden" : ""}`}>
          {selected && (
            <>
              <button onClick={() => setSelected(null)}>← Back</button>
              <RichTextEditor value={content} onChange={setContent} />
              <button onClick={save}>Save</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
