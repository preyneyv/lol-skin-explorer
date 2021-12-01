import { Route, Routes, HashRouter } from "react-router-dom";

import { Home } from "./pages/home";
import { Champion, ChampionSkin } from "./pages/champions";
import { Skinline, SkinlineSkin } from "./pages/skinlines";

import { _ready } from "./data";
import { usePromise } from "./hooks";

import "./App.css";
import { useEffect } from "react";

function App() {
  const ready = usePromise(_ready);
  useEffect(() => {
    document.body.scrollTo({ top: 0 });
  }, [window.location.hash]);
  return (
    <HashRouter>
      {ready ? (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/champions/:champion" element={<Champion />} />
          <Route
            path="/champions/:champion/skins/:skinId"
            element={<ChampionSkin />}
          />
          <Route path="/skinlines/:lineId" element={<Skinline />} />
          <Route
            path="/skinlines/:lineId/skins/:skinId"
            element={<SkinlineSkin />}
          />
        </Routes>
      ) : (
        <div className="preloader">
          <div>
            <div />
            <div />
            <div />
          </div>
        </div>
      )}
    </HashRouter>
  );
}

export default App;
