import { useState } from "react";

export default function QuickCapture() {
  const [text, setText] = useState("");

  function handleSave() {
    if (!text.trim()) return;
    setText("");
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1>Quick Capture</h1>
          <p className="page-subtitle">
            Jot something down before it disappears.
          </p>
        </div>
      </header>

      <div className="card">
        <div className="card-body">
          <textarea
            placeholder="Type something…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
          />

          <button onClick={handleSave} style={{ marginTop: 12 }}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
