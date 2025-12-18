import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function sendMagicLink() {
    if (!email) return;

    setLoading(true);

    await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    setLoading(false);
    setSent(true);
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Sign in</h1>

      {!sent ? (
        <>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <br />

          <button onClick={sendMagicLink} disabled={loading}>
            {loading ? "Sending…" : "Send magic link"}
          </button>
        </>
      ) : (
        <p>
          Check your email and click the link to finish signing in.
        </p>
      )}
    </div>
  );
}
