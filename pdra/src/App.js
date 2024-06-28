import React, { useState } from "react";
import Map from "./components/map.jsx";
import Building from "./components/Building.jsx";
import Road from "./components/Road.jsx";
import "./App.css";

function App() {
  const [showBuilding, setShowBuilding] = useState(false);
  const [showRoad, setShowRoad] = useState(false);

  return (
    <div className="App">
      <Map />
      <div className="button-container">
        <button onClick={() => setShowBuilding(!showBuilding)}>
          {showBuilding ? "Hide Building" : "Show Building"}
        </button>
        <button onClick={() => setShowRoad(!showRoad)}>
          {showRoad ? "Hide Road" : "Show Road"}
        </button>
      </div>
      {showBuilding && <Building />}
      {showRoad && <Road />}
    </div>
  );
}

export default App;
