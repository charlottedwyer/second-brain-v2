import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Result = {
  id: string;
  type: "Note" | "Wiki" | "Media" | "Event";
  title: string;
  meta?: string;
};

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);

  async function runSearch(q: string) {
    if (!q.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);

    const [notes, wiki, media, events] = await Promise.all([
      supabase
        .from("notes")
        .select("id, title")
        .ilike("title", `%${q}%`)
        .limit(5),

      supabase
        .from("wiki_pages")
        .select("id, title")
        .ilike("title", `%${q}%`)
        .limit(5),

      supabase
        .from("media")
        .select("id, title, kind")
        .ilike("title", `%${q}%`)
        .limit(5),

      supabase
        .from("calendar_events")
        .select("id, title, event_date")
        .ilike("title", `%${q}%`)
        .limit(5),
    ]);

    const merged: Result[] = [];

    notes.data?.forEach((n) =>
      merged.push({ id: n.id, type: "Note", title: n.title })
    );

    wiki.data?.forEach((w) =>
      merged.push({ id: w.id, type: "Wiki", title: w.title })
    );

    media.data?.forEach((m) =>
      merged.push({
        id: m.id,
        type: "Media",
        title: m.title,
        meta: m.kind,
      })
    );

    events.data?.forEach((e) =>
      merged.push({
        id: e.id,
        type: "Event",
        title: e.title,
        meta: e.event_date,
      })
    );

    setResults(merged);
    setLoading(false);
  }

  useEffect(() => {
    const t = setTimeout(() => runSearch(query), 250);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <div>
      <input
        placeholder="Search everything…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: "100%",
          padding: "8px 10px",
          fontSize: "0.95rem",
          marginBottom: 8,
        }}
      />

      {loading && (
        <p style={{ opacity: 0.6, margin: 0 }}>Searching…</p>
      )}

      {results.length > 0 && (
        <ul>
          {results.map((r) => (
            <li key={`${r.type}-${r.id}`}>
              <strong>{r.title}</strong>{" "}
              <span style={{ opacity: 0.6 }}>
                [{r.type}
                {r.meta ? ` • ${r.meta}` : ""}]
              </span>
            </li>
          ))}
        </ul>
      )}

      {!loading && query && results.length === 0 && (
        <p style={{ opacity: 0.6, margin: 0 }}>
          No results found.
        </p>
      )}
    </div>
  );
}
