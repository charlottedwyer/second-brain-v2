import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

/* =====================
   TYPES
   ===================== */

type MediaItem = {
  id: string;
  title: string;
  kind: string;
  rating: number | null;
};

const MEDIA_KINDS = ["Book", "Film", "Show", "Game", "Other"];

/* =====================
   COMPONENT
   ===================== */

export default function MediaList() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [selected, setSelected] = useState<MediaItem | null>(null);

  const [title, setTitle] = useState("");
  const [kind, setKind] = useState("Book");
  const [rating, setRating] = useState<number | null>(null);

  const [filter, setFilter] = useState<string>("All");

  useEffect(() => {
    fetchMedia();
  }, []);

  async function fetchMedia() {
    const { data, error } = await supabase
      .from("media")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch media:", error);
      return;
    }

    if (data) setItems(data);
  }

  async function createItem() {
    if (!title.trim()) return;

    const { data, error } = await supabase
      .from("media")
      .insert([
        {
          title: title.trim(),
          kind,
          rating,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Failed to create media:", error);
      return;
    }

    if (data) {
      setItems((prev) => [data, ...prev]);
      resetForm();
    }
  }

  async function saveItem() {
    if (!selected) return;

    const { error } = await supabase
      .from("media")
      .update({
        title: title.trim(),
        kind,
        rating,
        updated_at: new Date().toISOString(),
      })
      .eq("id", selected.id);

    if (error) {
      console.error("Failed to update media:", error);
      return;
    }

    setItems((prev) =>
      prev.map((i) =>
        i.id === selected.id
          ? { ...i, title, kind, rating }
          : i
      )
    );

    setSelected(null);
    resetForm();
  }

  async function deleteItem() {
    if (!selected) return;

    const confirmDelete = confirm("Delete this media item?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("media")
      .delete()
      .eq("id", selected.id);

    if (error) {
      console.error("Failed to delete media:", error);
      return;
    }

    setItems((prev) => prev.filter((i) => i.id !== selected.id));
    setSelected(null);
    resetForm();
  }

  function resetForm() {
    setTitle("");
    setKind("Book");
    setRating(null);
  }

  const visibleItems =
    filter === "All"
      ? items
      : items.filter((i) => i.kind === filter);

  return (
    <div className="page-container">
      {/* HEADER */}
      <header className="page-header">
        <div>
          <h1>Media</h1>
          <p className="page-subtitle">
            Books, films, shows, and anything that inspires you.
          </p>
        </div>

        <div className="page-actions">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All</option>
            {MEDIA_KINDS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 16,
        }}
      >
        {visibleItems.map((m) => (
          <div
            key={m.id}
            className="card"
            style={{ textAlign: "center", cursor: "pointer" }}
            onClick={() => {
              setSelected(m);
              setTitle(m.title);
              setKind(m.kind);
              setRating(m.rating);
            }}
          >
            <strong>{m.title}</strong>
            <p style={{ opacity: 0.6 }}>{m.kind}</p>
            {m.rating !== null && <p>⭐ {m.rating}</p>}
          </div>
        ))}
      </div>

      {/* EDIT / CREATE PANEL */}
      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-header">
          <h2>{selected ? "Edit media" : "Add new media"}</h2>
        </div>

        <div className="card-body">
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <select
            value={kind}
            onChange={(e) => setKind(e.target.value)}
          >
            {MEDIA_KINDS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>

          <input
            type="number"
            min={0}
            max={5}
            step={1}
            placeholder="Rating (0–5)"
            value={rating ?? ""}
            onChange={(e) =>
              setRating(
                e.target.value === "" ? null : Number(e.target.value)
              )
            }
          />

          <div style={{ display: "flex", gap: 8 }}>
            {selected ? (
              <>
                <button onClick={saveItem}>Save</button>
                <button onClick={deleteItem}>Delete</button>
              </>
            ) : (
              <button onClick={createItem}>Add</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
