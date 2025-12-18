import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";

export default function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!user) return <Auth />;

return <Dashboard />;
}
