import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type MediaItem = {
  id: string;
  title: string;
  kind: string;
};

export default function Media() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState("book");

  async function loadMedia() {
    const { data, error } = await supabase
      .from("media")
      .select("id, title, kind")
      .order("created_at", { ascending: false });

    if (error) return;
    setItems(data ?? []);
  }

  async function addMedia() {
    if (!title.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("media")
      .insert({
        title,
        kind,
        user_id: user.id,
      })
      .select("id, title, kind")
      .single();

    if (error || !data) return;

    setItems((prev) => [data, ...prev]);
    setTitle("");
  }

  useEffect(() => {
    loadMedia();
  }, []);

  return (
    <div>
      <p style={{ opacity: 0.7, marginBottom: 12 }}>
        Books, films, shows, music.
      </p>

      <div style={{ marginBottom: 16 }}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          value={kind}
          onChange={(e) => setKind(e.target.value)}
          style={{ marginLeft: 8 }}
        >
          <option value="book">Book</option>
          <option value="film">Film</option>
          <option value="show">Show</option>
          <option value="music">Music</option>
        </select>

        <button onClick={addMedia} style={{ marginLeft: 8 }}>
          Add
        </button>
      </div>

      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <strong>{item.title}</strong>{" "}
            <span style={{ opacity: 0.6 }}>({item.kind})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
