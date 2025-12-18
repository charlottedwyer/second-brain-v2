import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function QuickCapture() {
  const [text, setText] = useState("");
  const [inboxId, setInboxId] = useState<string | null>(null);

  async function ensureInbox() {
    const { data: existing } = await supabase
      .from("notebooks")
      .select("id")
      .eq("name", "Inbox")
      .single();

    if (existing) {
      setInboxId(existing.id);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: created } = await supabase
      .from("notebooks")
      .insert({
        name: "Inbox",
        user_id: user.id,
      })
      .select("id")
      .single();

    if (created) setInboxId(created.id);
  }

  async function submit() {
    if (!text.trim() || !inboxId) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("notes").insert({
      title: text.slice(0, 50),
      content: text,
      user_id: user.id,
      notebook_id: inboxId,
    });

    setText("");
  }

  useEffect(() => {
    ensureInbox();
  }, []);

  return (
    <input
      placeholder="Quick capture…"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") submit();
      }}
      style={{
        width: "100%",
        padding: "8px 10px",
        fontSize: "0.95rem",
      }}
    />
  );
}
