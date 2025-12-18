import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type MediaKind = "book" | "film" | "show";

type MediaItem = {
  id: string;
  title: string;
  kind: MediaKind;
  state: string;
  progress: number | null;
  season: number | null;
  episode: number | null;
  rating: number | null;
};

const STATES: Record<MediaKind, string[]> = {
  book: ["want", "reading", "read"],
  film: ["want", "watched"],
  show: ["want", "watching", "watched"],
};

export default function Media() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<MediaKind>("book");

  async function loadMedia() {
    const { data } = await supabase
      .from("media")
      .select(
        "id, title, kind, state, progress, season, episode, rating"
      )
      .order("created_at", { ascending: false });

    setItems(data ?? []);
  }

  async function addMedia() {
    if (!title.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("media")
      .insert({
        title,
        kind,
        state: "want",
        user_id: user.id,
      })
      .select()
      .single();

    if (!data) return;

    setItems((prev) => [data, ...prev]);
    setTitle("");
  }

  async function updateItem(
    id: string,
    updates: Partial<MediaItem>
  ) {
    const { data } = await supabase
      .from("media")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (!data) return;

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
        Track books, films, and shows intentionally.
      </p>

      {/* Add media */}
      <div style={{ marginBottom: 16 }}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          value={kind}
          onChange={(e) => setKind(e.target.value as MediaKind)}
          style={{ marginLeft: 8 }}
        >
          <option value="book">Book</option>
          <option value="film">Film</option>
          <option value="show">Show</option>
        </select>

        <button onClick={addMedia} style={{ marginLeft: 8 }}>
          Add
        </button>
      </div>

      {/* List */}
      <ul>
        {items.map((item) => (
          <li key={item.id} style={{ marginBottom: 16 }}>
            <strong>{item.title}</strong>{" "}
            <span style={{ opacity: 0.6 }}>({item.kind})</span>

            {/* State buttons */}
            <div style={{ marginTop: 6 }}>
              {STATES[item.kind].map((s) => (
                <button
                  key={s}
                  onClick={() =>
                    updateItem(item.id, {
                      state: s,
                      progress: null,
                      season: null,
                      episode: null,
                      rating: null,
                    })
                  }
                  style={{
                    marginRight: 6,
                    opacity: item.state === s ? 1 : 0.5,
                  }}
                >
                  {s.replace("-", " ")}
                </button>
              ))}
            </div>

            {/* Conditional inputs */}
            {item.kind === "book" &&
              item.state === "reading" && (
                <div style={{ marginTop: 6 }}>
                  <input
                    type="number"
                    placeholder="% read"
                    value={item.progress ?? ""}
                    onChange={(e) =>
                      updateItem(item.id, {
                        progress: Number(e.target.value),
                      })
                    }
                  />
                </div>
              )}

            {item.kind === "show" &&
              item.state === "watching" && (
                <div style={{ marginTop: 6 }}>
                  <input
                    type="number"
                    placeholder="Season"
                    value={item.season ?? ""}
                    onChange={(e) =>
                      updateItem(item.id, {
                        season: Number(e.target.value),
                      })
                    }
                    style={{ width: 80, marginRight: 6 }}
                  />
                  <input
                    type="number"
                    placeholder="Episode"
                    value={item.episode ?? ""}
                    onChange={(e) =>
                      updateItem(item.id, {
                        episode: Number(e.target.value),
                      })
                    }
                    style={{ width: 80 }}
                  />
                </div>
              )}

            {(item.state === "read" ||
              item.state === "watched") && (
              <div style={{ marginTop: 6 }}>
                <input
                  type="number"
                  placeholder="Rating"
                  value={item.rating ?? ""}
                  onChange={(e) =>
                    updateItem(item.id, {
                      rating: Number(e.target.value),
                    })
                  }
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
