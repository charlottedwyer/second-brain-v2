import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type MediaItem = {
  id: string;
  title: string;
  kind: string;
  status: string;
};

const STATUSES = ["to-read", "watching", "finished"];

export default function Media() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState("book");

  async function loadMedia() {
    const { data, error } = await supabase
      .from("media")
      .select("id, title, kind, status")
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
        status: "to-read",
        user_id: user.id,
      })
      .select("id, title, kind, status")
      .single();

    if (error || !data) return;

    setItems((prev) => [data, ...prev]);
    setTitle("");
  }

  async function updateStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from("media")
      .update({ status })
      .eq("id", id)
      .select("id, title, kind, status")
      .single();

    if (error || !data) return;

    setItems((prev) =>
      prev.map((item) => (item.id === id ? data : item))
    );
  }

  useEffect(() => {
    loadMedia();
  }, []);

  return (
    <div>
      <p style={{ opacity: 0.7, marginBottom: 12 }}>
        Books, films, shows, music — tracked intentionally.
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
          <li key={item.id} style={{ marginBottom: 12 }}>
            <strong>{item.title}</strong>{" "}
            <span style={{ opacity: 0.6 }}>
              ({item.kind})
            </span>

            <div style={{ marginTop: 4 }}>
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(item.id, s)}
                  style={{
                    marginRight: 6,
                    opacity: item.status === s ? 1 : 0.5,
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
