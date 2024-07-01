import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import osmtogeojson from 'osmtogeojson';

const API_KEY = "zSKe702Zq1told0U6bDZ";

const Road = () => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [roadsFetched, setRoadsFetched] = useState(false);

  useEffect(() => {
    const initializeMap = () => {
      mapRef.current = new maplibregl.Map({
        container: mapContainer.current,
        style: `https://api.maptiler.com/maps/basic-v2/style.json?key=${API_KEY}`,
        center: [80.326, 28.946], // Center of Mahendranagar City (adjust as needed)
        zoom: 14, // Adjust zoom level as needed
      });

      mapRef.current.addControl(new maplibregl.NavigationControl(), "top-right");

      mapRef.current.on('load', () => {
        fetchRoads();
      });
    };

    if (!mapRef.current) {
      initializeMap();
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  const fetchRoads = async () => {
    if (roadsFetched) return; // Prevent multiple fetches

    try {
      const query = `
        [out:json];
        (
          way["highway"](28.6200,80.0500,29.0500,80.5000); // Bounding box for Kanchanpur District
        );
        out body;
      `;

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `data=${encodeURIComponent(query)}`
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const json = await response.json();
      const geojson = osmtogeojson(json);

      if (mapRef.current.getSource('roads')) {
        mapRef.current.removeLayer('roads');
        mapRef.current.removeSource('roads');
      }

      mapRef.current.addSource('roads', {
        type: 'geojson',
        data: geojson
      });

      mapRef.current.addLayer({
        id: 'roads',
        type: 'line',
        source: 'roads',
        paint: {
          'line-color': '#FF0000',
          'line-width': 2
        }
      });

      setRoadsFetched(true);
    } catch (error) {
      console.error('Error fetching road data:', error);
      alert(`Error fetching road data: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Highways in Kanchanpur District</h2>
      <div ref={mapContainer} style={{ height: "500px", width: "100%" }} />
    </div>
  );
};

export default Road;
