// import React, { useEffect, useRef, useState } from "react";
// import maplibregl from "maplibre-gl";
// import "maplibre-gl/dist/maplibre-gl.css";
// import osmtogeojson from 'osmtogeojson';

// const API_KEY = "zSKe702Zq1told0U6bDZ";

// const Building = () => {
//   const mapContainer = useRef(null);
//   const mapRef = useRef(null);
//   const [buildingsFetched, setBuildingsFetched] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const fetchBuildings = async () => {
//     if (buildingsFetched) return; // Prevent multiple fetches

//     try {
//       const query = `
//         [out:json];
//         (
//           way["building"](28.946, 80.326, 28.951, 80.334); // Bounding box for Mahendranagar City
//         );
//         out body;
//       `;

//       const response = await fetch('https://overpass-api.de/api/interpreter', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded'
//         },
//         body: `data=${encodeURIComponent(query)}`
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const json = await response.json();
//       const geojson = osmtogeojson(json);

//       // Remove existing source if it exists
//       if (mapRef.current.getSource('buildings')) {
//         mapRef.current.removeLayer('buildings');
//         mapRef.current.removeLayer('buildings-border');
//         mapRef.current.removeSource('buildings');
//       }

//       mapRef.current.addSource('buildings', {
//         type: 'geojson',
//         data: geojson
//       });

//       mapRef.current.addLayer({
//         id: 'buildings',
//         type: 'fill',
//         source: 'buildings',
//         paint: {
//           'fill-color': '#888888',
//           'fill-opacity': 0.6
//         }
//       });

//       mapRef.current.addLayer({
//         id: 'buildings-border',
//         type: 'line',
//         source: 'buildings',
//         paint: {
//           'line-color': '#000000',
//           'line-width': 1
//         }
//       });

//       setBuildingsFetched(true); // Mark buildings as fetched
//       setLoading(false); // Hide loading indicator
//     } catch (error) {
//       console.error('Error fetching building data:', error);
//       alert(`Error fetching building data: ${error.message}`);
//       setLoading(false); // Hide loading indicator on error
//     }
//   };

//   useEffect(() => {
//     const initializeMap = () => {
//       mapRef.current = new maplibregl.Map({
//         container: mapContainer.current,
//         style: `https://api.maptiler.com/maps/basic-v2/style.json?key=${API_KEY}`,
//         center: [80.326, 28.946], // Center of Mahendranagar City
//         zoom: 14, // Adjust zoom level as needed
//       });

//       mapRef.current.addControl(new maplibregl.NavigationControl(), "top-right");

//       mapRef.current.on('load', () => {
//         // Fetch and display buildings
//         fetchBuildings();
//       });
//     };

//     if (!mapRef.current) {
//       initializeMap();
//     }

//     return () => {
//       if (mapRef.current) {
//         mapRef.current.remove();
//       }
//     };
//   }, []); // No dependencies to run effect only once on component mount

//   return (
//     <div>
//       <h2>Buildings in Mahendranagar City</h2>
//       {loading && <p>Loading...</p>}
//       <div ref={mapContainer} style={{ height: "500px", width: "100%" }} />
//     </div>
//   );
// };

// export default Building;

import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';

const MapComponent = () => {
  const mapContainer = useRef(null);
 const API_KEY = "zSKe702Zq1told0U6bDZ";

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/basic-v2/style.json?key=${API_KEY}`,
      center: [84.1240, 28.3949], // Nepal center coordinates
      zoom: 6
    });

    map.on('load', () => {
      fetchWeatherData(map);
    });

    return () => map.remove();
  }, []);

  const fetchWeatherData = (map) => {
    const apiUrl = 'https://api.rainviewer.com/public/weather-maps.json';

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const pastFrames = data.radar.past;

        // Loop through past frames (images) and add them to the map as raster layers
        pastFrames.forEach(frame => {
          const imageUrl = `${data.host}${frame.path}/256/{z}/{x}/{y}/2/1_1.png?key=${API_KEY}`;
          map.addSource(`rainviewer-${frame.time}`, {
            type: 'image',
            url: imageUrl,
            coordinates: [
              [68.0, 8.0],   // Bottom-left coordinate of the image
              [98.0, 37.0]   // Top-right coordinate of the image
            ]
          });

          map.addLayer({
            id: `rainviewer-${frame.time}-layer`,
            type: 'raster',
            source: `rainviewer-${frame.time}`,
            paint: {
              'raster-opacity': 0.85
            }
          });
        });

        // Optional: Implement animation logic here
        // You can cycle through frames to create an animation effect
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
      });
  };

  return <div ref={mapContainer} style={{ height: '100vh', width: '100%' }} />;
};

export default MapComponent;




