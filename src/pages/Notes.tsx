import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import NotesInNotebook from "../features/notes/NotesInNotebook";

type Notebook = {
  id: string;
  name: string;
};

export default function Notes() {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [activeNotebook, setActiveNotebook] = useState<Notebook | null>(null);

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
    const name = prompt("Notebook name");
    if (!name) return;

    const { data } = await supabase
      .from("notebooks")
      .insert([{ name }])
      .select()
      .single();

    if (data) {
      setNotebooks([...notebooks, data]);
    }
  }

  // 🔙 inside notebook view
  if (activeNotebook) {
    return (
      <NotesInNotebook
        notebook={activeNotebook}
        onBack={() => setActiveNotebook(null)}
      />
    );
  }

  // 📓 notebook grid view
  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1>Notebooks</h1>
          <p className="page-subtitle">
            Organise your notes into notebooks.
          </p>
        </div>

        <div className="page-actions">
          <button onClick={createNotebook}>New notebook</button>
        </div>
      </header>

      <div className="notebook-grid">
        {notebooks.map((nb, i) => (
          <div
            key={nb.id}
            className="notebook-card"
            onClick={() => setActiveNotebook(nb)}
          >
            <div className={`notebook-cover cover-${i % 6}`} />
            <div className="notebook-title">{nb.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
