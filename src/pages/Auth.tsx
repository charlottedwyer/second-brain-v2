import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Auth() {
  const [email, setEmail] = useState("");

  async function signIn() {
    await supabase.auth.signInWithOtp({ email });
    alert("Check your email for the login link");
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Sign in</h1>
      <input
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={signIn}>Send magic link</button>
    </div>
  );
}
