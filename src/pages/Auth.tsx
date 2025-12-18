import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function handleAuth() {
    setLoading(true);
    setError(null);
    setInfo(null);

    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setError("Please enter an email and password.");
      setLoading(false);
      return;
    }

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        setInfo("Account created. You can sign in now.");
        setIsSignUp(false);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) setError(error.message);
    }

    setLoading(false);
  }

  return (
    <div style={{ padding: 24, maxWidth: 420, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 12 }}>
        {isSignUp ? "Sign up" : "Sign in"}
      </h1>

      <input
        type="email"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", marginBottom: 8 }}
      />

      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: 12 }}
      />

      <button
        onClick={handleAuth}
        disabled={loading}
        style={{ width: "100%" }}
      >
        {loading
          ? "Please wait…"
          : isSignUp
          ? "Create account"
          : "Sign in"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {info && <p style={{ opacity: 0.8 }}>{info}</p>}

      <hr style={{ margin: "16px 0" }} />

      <button
        onClick={() => {
          setIsSignUp(!isSignUp);
          setError(null);
          setInfo(null);
        }}
        style={{ fontSize: 14, width: "100%" }}
      >
        {isSignUp
          ? "Already have an account? Sign in"
          : "Need an account? Sign up"}
      </button>
    </div>
  );
}
