import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

/* =====================
   TYPES
   ===================== */

type MediaItem = {
  id: number;
  title: string;
  type: string;
  rating: number | null;
};

const MEDIA_TYPES = ["Book", "Film", "Show", "Game", "Other"];

/* =====================
   COMPONENT
   ===================== */

export default function Media() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [selected, setSelected] = useState<MediaItem | null>(null);

  const [title, setTitle] = useState("");
  const [type, setType] = useState("Book");
  const [rating, setRating] = useState<number | null>(null);

  const [filter, setFilter] = useState<string>("All");

  useEffect(() => {
    fetchMedia();
  }, []);

  async function fetchMedia() {
    const { data } = await supabase
      .from("media")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setItems(data);
  }

  async function createItem() {
    if (!title.trim()) return;

    const { data } = await supabase
      .from("media")
      .insert([
        {
          title,
          type,
          rating,
        },
      ])
      .select()
      .single();

    if (data) {
      setItems([data, ...items]);
      resetForm();
    }
  }

  async function saveItem() {
    if (!selected) return;

    await supabase
      .from("media")
      .update({
        title,
        type,
        rating,
      })
      .eq("id", selected.id);

    setItems((prev) =>
      prev.map((i) =>
        i.id === selected.id ? { ...i, title, type, rating } : i
      )
    );

    setSelected(null);
    resetForm();
  }

  async function deleteItem() {
    if (!selected) return;

    const confirmDelete = confirm("Delete this media item?");
    if (!confirmDelete) return;

    await supabase.from("media").delete().eq("id", selected.id);

    setItems((prev) => prev.filter((i) => i.id !== selected.id));
    setSelected(null);
    resetForm();
  }

  function resetForm() {
    setTitle("");
    setType("Book");
    setRating(null);
  }

  const visibleItems =
    filter === "All"
      ? items
      : items.filter((i) => i.type === filter);

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
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All</option>
            {MEDIA_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
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
              setType(m.type);
              setRating(m.rating);
            }}
          >
            <strong>{m.title}</strong>
            <p style={{ opacity: 0.6 }}>{m.type}</p>
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

          <select value={type} onChange={(e) => setType(e.target.value)}>
            {MEDIA_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <input
            type="number"
            min={0}
            max={5}
            step={0.5}
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
