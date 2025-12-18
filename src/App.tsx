import { useEffect, useState } from "react";
import "./index.css";
import { supabase } from "./lib/supabaseClient";

import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";

export default function App() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  const [loadingSession, setLoadingSession] = useState(true);
  const [signedIn, setSignedIn] = useState(false);

  // Theme apply + persist
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Auth session bootstrap + listener
  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSignedIn(Boolean(data.session));
      setLoadingSession(false);
    }

    bootstrap();

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSignedIn(Boolean(session));
        setLoadingSession(false);
      }
    );

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (loadingSession) {
    return (
      <div style={{ padding: 24 }}>
        <p style={{ opacity: 0.7 }}>Loading…</p>
      </div>
    );
  }

  if (!signedIn) {
    return <Auth />;
  }

  return <Dashboard theme={theme} setTheme={setTheme} />;
}
