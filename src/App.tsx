import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Dashboard from "./pages/Dashboard";
import Notes from "./pages/Notes";
import Calendar from "./pages/Calendar";
import Wiki from "./pages/Wiki";
import Health from "./pages/Health";
import Media from "./pages/Media";
import Stats from "./pages/Stats";
import Habits from "./pages/Habits";
import MedicationsSetup from "./pages/MedicationsSetup";

import Navigation from "./components/Navigation";

export default function App() {
  const [theme, setTheme] = useState("light");

  return (
    <BrowserRouter>
      <div data-theme={theme}>
        <Navigation />

        <Routes>
          <Route path="/" element={<Dashboard theme={theme} setTheme={setTheme} />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/wiki" element={<Wiki />} />
          <Route path="/health" element={<Health />} />
          <Route path="/media" element={<Media />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/medications" element={<MedicationsSetup />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
