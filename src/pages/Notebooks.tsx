import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Notebook = {
  id: string;
  name: string;
};

type Props = {
  activeNotebook: string | null;
  onSelect: (id: string | null) => void;
};

export default function Notebooks({ activeNotebook, onSelect }: Props) {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    fetchNotebooks();
  }, []);

  async function fetchNotebooks() {
    const { data } = await supabase
      .from("notebooks")
      .select("*")
      .order("created_at", { ascending: true });

    if (data) setNotebooks(data);
  }

  async function createNotebook() {
    if (!newName.trim()) return;

    const { data } = await supabase
      .from("notebooks")
      .insert([{ name: newName }])
      .select()
      .single();

    if (data) {
      setNotebooks([...notebooks, data]);
      setNewName("");
      onSelect(data.id);
    }
  }

  async function deleteNotebook(id: string) {
    const confirmDelete = confirm(
      "Delete this notebook and all its notes?"
    );
    if (!confirmDelete) return;

    await supabase.from("notebooks").delete().eq("id", id);

    if (activeNotebook === id) onSelect(null);
    fetchNotebooks();
  }

  return (
    <div style={{ marginBottom: 16 }}>
      <h3>Notebooks</h3>

      <div style={{ marginBottom: 8 }}>
        {notebooks.map((nb) => (
          <div
            key={nb.id}
            style={{
              padding: 8,
              borderRadius: 6,
              cursor: "pointer",
              background:
                activeNotebook === nb.id
                  ? "var(--border)"
                  : "transparent",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            onClick={() => onSelect(nb.id)}
          >
            <span>{nb.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteNotebook(nb.id);
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <input
        placeholder="New notebook"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
      />
      <button onClick={createNotebook} style={{ marginTop: 6 }}>
        Add notebook
      </button>
    </div>
  );
}
