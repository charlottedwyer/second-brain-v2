import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import type { Session } from "@supabase/supabase-js";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div style={{ padding: 24 }}>Loading…</div>;
  }

  if (!session) {
    return <Auth />;
  }

  return <Dashboard />;
}
