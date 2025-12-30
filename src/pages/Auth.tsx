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
    if (loading) return;

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
    <div
      className="page-container"
      style={{
        maxWidth: 420,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div className="card" style={{ width: "100%" }}>
        {/* HEADER */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ marginBottom: 4 }}>
            {isSignUp ? "Create account" : "Welcome back"}
          </h1>
          <p style={{ opacity: 0.65 }}>
            {isSignUp
              ? "Start building your second brain."
              : "Sign in to continue."}
          </p>
        </div>

        {/* FORM */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handleAuth} disabled={loading}>
            {loading
              ? "Please wait…"
              : isSignUp
              ? "Create account"
              : "Sign in"}
          </button>
        </div>

        {/* MESSAGES */}
        {error && (
          <p
            style={{
              color: "#ef4444",
              marginTop: 12,
              fontSize: 14,
            }}
          >
            {error}
          </p>
        )}

        {info && (
          <p
            style={{
              marginTop: 12,
              fontSize: 14,
              opacity: 0.75,
            }}
          >
            {info}
          </p>
        )}

        {/* TOGGLE */}
        <div
          style={{
            marginTop: 20,
            paddingTop: 16,
            borderTop: "1px solid var(--border)",
          }}
        >
          <button
            className="secondary"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
              setInfo(null);
            }}
            style={{ width: "100%" }}
          >
            {isSignUp
              ? "Already have an account? Sign in"
              : "Need an account? Create one"}
          </button>
        </div>
      </div>
    </div>
  );
}
