import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Dashboard from "./pages/Dashboard";
import Notes from "./pages/Notes";
import Wiki from "./pages/Wiki";
import Calendar from "./pages/Calendar";
import Habits from "./pages/Habits";
import Media from "./pages/Media";
import Stats from "./pages/Stats";

import Navigation from "./components/Navigation";

export default function App() {
  const [theme, setTheme] = useState("light");

  return (
    <div data-theme={theme}>
      <Navigation />

      <Routes>
        <Route path="/" element={<Dashboard theme={theme} setTheme={setTheme} />} />
        <Route path="/notes" element={<Notes notebookId={null} />} />
        <Route path="/wiki" element={<Wiki />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/media" element={<Media />} />
        <Route path="/stats" element={<Stats />} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
