import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Notebook = {
  id: string;
  name: string;
};

const PROTECTED_NOTEBOOKS = ["Inbox", "Journal"];

export default function Notebooks({
  activeNotebook,
  onSelect,
}: {
  activeNotebook: string | null;
  onSelect: (id: string | null) => void;
}) {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [newName, setNewName] = useState("");
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
    if (!newName.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("notebooks")
      .insert({
        name: newName.trim(),
        user_id: user.id,
      })
      .select()
      .single();

    if (!data) return;

    setNotebooks((prev) => [...prev, data]);
    setNewName("");
  }

  async function renameNotebook(id: string) {
    if (!editingName.trim()) return;

    const { data } = await supabase
      .from("notebooks")
      .update({ name: editingName.trim() })
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
      <h3 style={{ marginBottom: 8 }}>Notebooks</h3>

      {/* Create notebook */}
      <div style={{ marginBottom: 12 }}>
        <input
          placeholder="New notebook"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button onClick={createNotebook} style={{ marginLeft: 6 }}>
          Create
        </button>
      </div>

      <ul>
        {/* All notes */}
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

        {notebooks.map((nb) => {
          const isProtected = PROTECTED_NOTEBOOKS.includes(nb.name);

          return (
            <li key={nb.id}>
              {editingId === nb.id ? (
                <>
                  <input
                    value={editingName}
                    onChange={(e) =>
                      setEditingName(e.target.value)
                    }
                  />
                  <button
                    onClick={() => renameNotebook(nb.id)}
                    style={{ marginLeft: 6 }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditingName("");
                    }}
                    style={{ marginLeft: 6 }}
                  >
                    Cancel
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

                  {!isProtected && (
                    <>
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
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
