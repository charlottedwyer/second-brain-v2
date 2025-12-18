import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Notebook = {
  id: string;
  name: string;
};

export default function Notebooks({
  activeNotebook,
  onSelect,
}: {
  activeNotebook: string | null;
  onSelect: (id: string | null) => void;
}) {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  async function loadNotebooks() {
    const { data } = await supabase
      .from("notebooks")
      .select("id, name")
      .order("created_at", { ascending: true });

    setNotebooks(data ?? []);
  }

  async function createNotebook() {
    if (!name.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("notebooks")
      .insert({ name, user_id: user.id })
      .select()
      .single();

    if (!data) return;

    setNotebooks((prev) => [...prev, data]);
    setName("");
  }

  async function renameNotebook(id: string) {
    const { data } = await supabase
      .from("notebooks")
      .update({ name: editingName })
      .eq("id", id)
      .select()
      .single();

    if (!data) return;

    setNotebooks((prev) =>
      prev.map((n) => (n.id === id ? data : n))
    );

    setEditingId(null);
    setEditingName("");
  }

  async function deleteNotebook(id: string) {
    await supabase.from("notebooks").delete().eq("id", id);
    setNotebooks((prev) => prev.filter((n) => n.id !== id));
    onSelect(null);
  }

  useEffect(() => {
    loadNotebooks();
  }, []);

  return (
    <div style={{ marginBottom: 16 }}>
      <h3>Notebooks</h3>

      <div style={{ marginBottom: 12 }}>
        <input
          placeholder="New notebook"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={createNotebook} style={{ marginLeft: 6 }}>
          Create
        </button>
      </div>

      <ul>
        <li>
          <button
            onClick={() => onSelect(null)}
            style={{
              fontWeight: activeNotebook === null ? "bold" : "normal",
            }}
          >
            All notes
          </button>
        </li>

        {notebooks.map((nb) => (
          <li key={nb.id}>
            {editingId === nb.id ? (
              <>
                <input
                  value={editingName}
                  onChange={(e) =>
                    setEditingName(e.target.value)
                  }
                />
                <button onClick={() => renameNotebook(nb.id)}>
                  Save
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onSelect(nb.id)}
                  style={{
                    fontWeight:
                      activeNotebook === nb.id ? "bold" : "normal",
                  }}
                >
                  {nb.name}
                </button>
                <button
                  onClick={() => {
                    setEditingId(nb.id);
                    setEditingName(nb.name);
                  }}
                  style={{ marginLeft: 6 }}
                >
                  Rename
                </button>
                <button
                  onClick={() => deleteNotebook(nb.id)}
                  style={{ marginLeft: 6 }}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
