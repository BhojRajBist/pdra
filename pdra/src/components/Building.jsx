import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import osmtogeojson from 'osmtogeojson';

const API_KEY = "zSKe702Zq1told0U6bDZ";

const Building = () => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [buildingsFetched, setBuildingsFetched] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeMap = () => {
      mapRef.current = new maplibregl.Map({
        container: mapContainer.current,
        style: `https://api.maptiler.com/maps/basic-v2/style.json?key=${API_KEY}`,
        center: [80.326, 28.946], // Center of Mahendranagar City
        zoom: 14, // Adjust zoom level as needed
      });

      mapRef.current.addControl(new maplibregl.NavigationControl(), "top-right");

      mapRef.current.on('load', () => {
        // Fetch and display buildings
        fetchBuildings();
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

  const fetchBuildings = async () => {
    if (buildingsFetched) return; // Prevent multiple fetches

    try {
      const query = `
        [out:json];
        (
          way["building"](28.946, 80.326, 28.951, 80.334); // Bounding box for Mahendranagar City
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

      // Remove existing source if it exists
      if (mapRef.current.getSource('buildings')) {
        mapRef.current.removeLayer('buildings');
        mapRef.current.removeLayer('buildings-border');
        mapRef.current.removeSource('buildings');
      }

      mapRef.current.addSource('buildings', {
        type: 'geojson',
        data: geojson
      });

      mapRef.current.addLayer({
        id: 'buildings',
        type: 'fill',
        source: 'buildings',
        paint: {
          'fill-color': '#888888',
          'fill-opacity': 0.6
        }
      });

      mapRef.current.addLayer({
        id: 'buildings-border',
        type: 'line',
        source: 'buildings',
        paint: {
          'line-color': '#000000',
          'line-width': 1
        }
      });

      setBuildingsFetched(true); // Mark buildings as fetched
      setLoading(false); // Hide loading indicator
    } catch (error) {
      console.error('Error fetching building data:', error);
      alert(`Error fetching building data: ${error.message}`);
      setLoading(false); // Hide loading indicator on error
    }
  };

  return (
    <div>
      <h2>Buildings in Mahendranagar City</h2>
      {loading && <p>Loading...</p>}
      <div ref={mapContainer} style={{ height: "500px", width: "100%" }} />
    </div>
  );
};

export default Building;

