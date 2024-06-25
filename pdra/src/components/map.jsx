// // src/components/Map.jsx
// import React, { useEffect } from 'react';
// import maplibregl from 'maplibre-gl';

// export default function Map() {
//     useEffect(() => {
//         // Replace 'YOUR_MAPLIBRE_ACCESS_TOKEN' with your actual Maplibre access token
//         maplibregl.accessToken = 'zSKe702Zq1told0U6bDZ';

//         const map = new maplibregl.Map({
//             container: 'map', // container id specified in the div
//             style: 'https://cdn.maplibre.org/maplibre-gl-js/v0.13.1/maplibre-gl.css',
//             center: [84.1240, 28.3949], // starting position [lng, lat]
//             zoom: 5 // starting zoom
//         });

//         return () => {
//             map.remove();
//         };
//     }, []);

//     return (
//         <div style={{ display: 'flex', height: '100vh' }}>
//             <div style={{ width: '20%', backgroundColor: 'black' }}></div>
//             <div id="map" style={{ width: '80%', height: '100vh' }}></div>
//         </div>
//     );
// }


import React, { useRef, useEffect } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import * as turf from "@turf/turf";

const API_KEY = "zSKe702Zq1told0U6bDZ";

export default function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const lat = 28.3949;
  const lng = 84.124;
  const zoom = 6.5;

  useEffect(() => {
    if (map.current) return; // stops map from initializing more than once

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/basic-v2/style.json?key=${API_KEY}`,
      center: [lng, lat],
      zoom: zoom,
    });

    map.current.addControl(new maplibregl.NavigationControl(), "top-right");
  }, [lng, lat, zoom]);

  return (
    <div className="map-wrap" style={{ display: "flex", height: "100vh"}}>
      <div style={{ width: "20%", backgroundColor: "black" }} />
      <div style={{ width: "80%" }}>
        <div ref={mapContainer} className="map" style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
}



