import { useEffect, useState } from "react";
import "./index.css";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return <Dashboard theme={theme} setTheme={setTheme} />;
}
