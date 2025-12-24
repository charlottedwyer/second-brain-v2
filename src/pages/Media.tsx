import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type MediaItem = {
  id: number;
  title: string;
  type: string;
  rating: number | null;
};

export default function Media() {
  const [items, setItems] = useState<MediaItem[]>([]);

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
      </header>

      {/* LIBRARY */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 16,
        }}
      >
        {items.map((m) => (
          <div
            key={m.id}
            className="card"
            style={{ textAlign: "center" }}
          >
            <strong>{m.title}</strong>
            <p style={{ opacity: 0.6 }}>{m.type}</p>
            {m.rating && <p>⭐ {m.rating}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
