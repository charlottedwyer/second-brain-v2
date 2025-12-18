import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import Auth from "./pages/Auth";
import Notes from "./pages/Notes";

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

  return <Notes />;
}
