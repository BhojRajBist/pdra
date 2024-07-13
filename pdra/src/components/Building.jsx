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


// import React, { useState, useEffect, useRef } from 'react';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// const WeatherMap = () => {
//     const mapRef = useRef(null);
//     const [mapFrames, setMapFrames] = useState([]);
//     const [animationPosition, setAnimationPosition] = useState(0);
//     const [animationTimer, setAnimationTimer] = useState(null);
//     const [optionKind, setOptionKind] = useState('radar'); // 'radar' or 'satellite'
//     const [optionColorScheme, setOptionColorScheme] = useState('2'); // from 0 to 8
//     const [optionTileSize, setOptionTileSize] = useState('256'); // 256 or 512

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await fetch('https://api.rainviewer.com/public/weather-maps.json');
//                 const data = await response.json();
//                 setMapFrames(getFrames(data, optionKind));
//             } catch (error) {
//                 console.error('Error fetching weather data:', error);
//             }
//         };

//         fetchData();

//         return () => {
//             if (animationTimer) clearTimeout(animationTimer);
//         };
//     }, [optionKind]);

//     useEffect(() => {
//         if (mapRef.current && mapFrames.length > 0) {
//             initializeMap();
//             showFrame(animationPosition);
//         }
//     }, [mapFrames]);

//     const initializeMap = () => {
//         const map = L.map(mapRef.current).setView([0, 0], 1);
//         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//             attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
//         }).addTo(map);
//         mapRef.current = map;
//     };

//     const getFrames = (data, kind) => {
//         let frames = [];
//         if (!data) return frames;

//         if (kind === 'satellite' && data.satellite && data.satellite.infrared) {
//             frames = data.satellite.infrared;
//         } else if (data.radar && data.radar.past) {
//             frames = data.radar.past;
//             if (data.radar.nowcast) {
//                 frames = frames.concat(data.radar.nowcast);
//             }
//         }
//         return frames;
//     };

//     const showFrame = (position) => {
//         const nextPosition = position >= mapFrames.length ? 0 : position < 0 ? mapFrames.length - 1 : position;
//         setAnimationPosition(nextPosition);
//         changeRadarPosition(nextPosition);
//     };

//     const changeRadarPosition = (position) => {
//         if (!mapRef.current || !mapFrames[position]) return;

//         const frame = mapFrames[position];
//         const colorScheme = optionKind === 'satellite' ? 0 : parseInt(optionColorScheme);
//         const tileSize = parseInt(optionTileSize);
//         const url = `${frame.path}/${tileSize}/{z}/{x}/{y}/${colorScheme}/1_1.png`;

//         const layer = L.tileLayer(`https://${url}`, {
//             tileSize: tileSize,
//             zIndex: frame.time
//         });

//         mapRef.current.eachLayer((layer) => {
//             if (layer instanceof L.TileLayer) {
//                 mapRef.current.removeLayer(layer);
//             }
//         });

//         layer.addTo(mapRef.current);

//         const pastOrForecast = frame.time > Date.now() / 1000 ? 'FORECAST' : 'PAST';
//         document.getElementById('timestamp').innerHTML = `${pastOrForecast}: ${new Date(frame.time * 1000).toString()}`;
//     };

//     const stop = () => {
//         if (animationTimer) {
//             clearTimeout(animationTimer);
//             setAnimationTimer(null);
//         }
//     };

//     const playStop = () => {
//         if (animationTimer) {
//             stop();
//         } else {
//             const timer = setInterval(() => {
//                 showFrame(animationPosition + 1);
//             }, 500);
//             setAnimationTimer(timer);
//         }
//     };

//     const setKind = (kind) => {
//         setOptionKind(kind);
//         setMapFrames(getFrames(apiData, kind));
//     };

//     const setColors = (e) => {
//         const colorScheme = e.target.value;
//         setOptionColorScheme(colorScheme);
//     };

//     const setTileSize = (e) => {
//         const tileSize = e.target.value;
//         setOptionTileSize(tileSize);
//     };

//     return (
//         <div style={{ position: 'relative', height: '100vh' }}>
//             <ul style={{ textAlign: 'center', position: 'absolute', top: 0, left: 0, right: 0, height: 50 }}>
//                 <li>
//                     <input type="radio" name="kind" checked={optionKind === 'radar'} onChange={() => setKind('radar')} />
//                     Radar (Past + Future)
//                     <input type="radio" name="kind" checked={optionKind === 'satellite'} onChange={() => setKind('satellite')} />
//                     Infrared Satellite
//                 </li>
//                 <li>
//                     <input type="button" onClick={() => { stop(); showFrame(animationPosition - 1); }} value="&lt;" />
//                 </li>
//                 <li>
//                     <input type="button" onClick={playStop} value="Play / Stop" />
//                 </li>
//                 <li>
//                     <input type="button" onClick={() => { stop(); showFrame(animationPosition + 1); }} value="&gt;" />
//                 </li>
//                 <li>
//                     <select id="colors" value={optionColorScheme} onChange={setColors}>
//                         <option value="0">Black and White Values</option>
//                         <option value="1">Original</option>
//                         <option value="2">Universal Blue</option>
//                         <option value="3">TITAN</option>
//                         <option value="4">The Weather Channel</option>
//                         <option value="5">Meteored</option>
//                         <option value="6">NEXRAD Level-III</option>
//                         <option value="7">RAINBOW @ SELEX-SI</option>
//                         <option value="8">Dark Sky</option>
//                     </select>
//                 </li>
//                 <li>
//                     <select id="tileSize" value={optionTileSize} onChange={setTileSize}>
//                         <option value="256">Tile Size: 256</option>
//                         <option value="512">Tile Size: 512</option>
//                     </select>
//                 </li>
//             </ul>
//             <div id="timestamp" style={{ textAlign: 'center', position: 'absolute', top: 50, left: 0, right: 0, height: 80 }}>FRAME TIME</div>
//             <div id="mapid" style={{ position: 'absolute', top: 80, left: 0, bottom: 0, right: 0 }} ref={mapRef}></div>
//         </div>
//     );
// };

// export default WeatherMap;

// WeatherMap.js
// import React, { useEffect, useState, useRef } from 'react';
// import maplibre from 'maplibre-gl';
// import axios from 'axios';

// const WeatherMap = () => {
//     const mapContainer = useRef(null);
//     const [map, setMap] = useState(null);
//     const [weatherData, setWeatherData] = useState(null);
//     const [animationPosition, setAnimationPosition] = useState(0);
//     const [animationTimer, setAnimationTimer] = useState(null);

//     useEffect(() => {
//         axios.get('http://127.0.0.1:8000/api/weather-maps/')
//             .then(response => {
//                 setWeatherData(response.data);
//                 initializeMap(response.data);
//             })
//             .catch(error => {
//                 console.error('Error fetching weather data:', error);
//             });

//         return () => {
//             if (map) map.remove();
//             if (animationTimer) clearTimeout(animationTimer);
//         }
//     }, []);

//     const initializeMap = (data) => {
//         const initialMap = new maplibre.Map({
//             container: mapContainer.current,
//             style: 'https://api.maptiler.com/maps/basic/style.json?key=zSKe702Zq1told0U6bDZ',
//             center: [2.3522, 48.8566],
//             zoom: 6
//         });

//         setMap(initialMap);

//         initialMap.on('load', () => {
//             // Load the first radar or satellite image
//             if (data.radar && data.radar.past.length > 0) {
//                 addLayer(data.radar.past[0].path, initialMap);
//             } else if (data.satellite && data.satellite.infrared.length > 0) {
//                 addLayer(data.satellite.infrared[0].path, initialMap);
//             }
//         });
//     };

//     const addLayer = (framePath, mapInstance) => {
//         if (!mapInstance.getLayer(framePath)) {
//             mapInstance.addSource(framePath, {
//                 type: 'raster',
//                 tiles: [
//                     `https://tilecache.rainviewer.com${framePath}/256/{z}/{x}/{y}/2/1_1.png`
//                 ],
//                 tileSize: 256
//             });

//             mapInstance.addLayer({
//                 id: framePath,
//                 type: 'raster',
//                 source: framePath,
//                 paint: {
//                     'raster-opacity': 0.6
//                 }
//             });
//         }
//     };

//     const changeFrame = (position) => {
//         if (!weatherData) return;

//         let frame;
//         if (weatherData.radar && weatherData.radar.past.length > 0) {
//             frame = weatherData.radar.past[position];
//             addLayer(frame.path, map);
//         } else if (weatherData.satellite && weatherData.satellite.infrared.length > 0) {
//             frame = weatherData.satellite.infrared[position];
//             addLayer(frame.path, map);
//         }

//         if (frame) {
//             setAnimationPosition(position);
//         }
//     };

//     const playAnimation = () => {
//         const nextPosition = (animationPosition + 1) % (weatherData.radar.past.length || weatherData.satellite.infrared.length);
//         changeFrame(nextPosition);
//         setAnimationTimer(setTimeout(playAnimation, 50));
//     };

//     const stopAnimation = () => {
//         if (animationTimer) {
//             clearTimeout(animationTimer);
//             setAnimationTimer(null);
//         }
//     };

//     const togglePlayStop = () => {
//         if (animationTimer) {
//             stopAnimation();
//         } else {
//             playAnimation();
//         }
//     };

//     return (
//         <div>
//             <div ref={mapContainer} style={{ width: '100%', height: '500px' }} />
//             <button onClick={togglePlayStop}>
//                 {animationTimer ? 'Stop' : 'Play'}
//             </button>
//         </div>
//     );
// };

// export default WeatherMap;



// import React, { useEffect, useState, useRef } from 'react';
// import maplibre from 'maplibre-gl';
// import axios from 'axios';

// const WeatherMap = () => {
//     const mapContainer = useRef(null);
//     const [map, setMap] = useState(null);
//     const [weatherData, setWeatherData] = useState(null);
//     const [animationPosition, setAnimationPosition] = useState(0);
//     const [animationTimer, setAnimationTimer] = useState(null);

//     useEffect(() => {
//         axios.get('http://127.0.0.1:8000/api/weather-maps/')
//             .then(response => {
//                 setWeatherData(response.data);
//                 initializeMap(response.data);
//             })
//             .catch(error => {
//                 console.error('Error fetching weather data:', error);
//             });

//         return () => {
//             if (map) map.remove();
//             if (animationTimer) clearTimeout(animationTimer);
//         }
//     }, []);

//     const initializeMap = (data) => {
//         const initialMap = new maplibre.Map({
//             container: mapContainer.current,
//             style: 'https://api.maptiler.com/maps/basic/style.json?key=zSKe702Zq1told0U6bDZ',
//             center: [84.1240, 28.3949], // Centered on Nepal
//             zoom: 6
//         });

//         setMap(initialMap);

//         initialMap.on('load', () => {
//             // Load the first radar or satellite image
//             if (data.radar && data.radar.past.length > 0) {
//                 addLayer(data.radar.past[0].path, initialMap);
//             } else if (data.satellite && data.satellite.infrared.length > 0) {
//                 addLayer(data.satellite.infrared[0].path, initialMap);
//             }
//         });
//     };

//     const addLayer = (framePath, mapInstance) => {
//         if (!mapInstance.getLayer(framePath)) {
//             mapInstance.addSource(framePath, {
//                 type: 'raster',
//                 tiles: [
//                     `https://tilecache.rainviewer.com${framePath}/256/{z}/{x}/{y}/2/1_1.png`
//                 ],
//                 tileSize: 256
//             });

//             mapInstance.addLayer({
//                 id: framePath,
//                 type: 'raster',
//                 source: framePath,
//                 paint: {
//                     'raster-opacity': 0.6
//                 }
//             });
//         }
//     };

//     const changeFrame = (position) => {
//         if (!weatherData) return;

//         let frame;
//         if (weatherData.radar && weatherData.radar.past.length > 0) {
//             frame = weatherData.radar.past[position];
//             addLayer(frame.path, map);
//         } else if (weatherData.satellite && weatherData.satellite.infrared.length > 0) {
//             frame = weatherData.satellite.infrared[position];
//             addLayer(frame.path, map);
//         }

//         if (frame) {
//             setAnimationPosition(position);
//         }
//     };

//     const playAnimation = () => {
//         const nextPosition = (animationPosition + 1) % (weatherData.radar.past.length || weatherData.satellite.infrared.length);
//         changeFrame(nextPosition);
//         setAnimationTimer(setTimeout(playAnimation, 200)); // Faster animation interval (200ms)
//     };

//     const stopAnimation = () => {
//         if (animationTimer) {
//             clearTimeout(animationTimer);
//             setAnimationTimer(null);
//         }
//     };

//     const togglePlayStop = () => {
//         if (animationTimer) {
//             stopAnimation();
//         } else {
//             playAnimation();
//         }
//     };

//     return (
//         <div>
//             <div ref={mapContainer} style={{ width: '100%', height: '500px' }} />
//             <button onClick={togglePlayStop}>
//                 {animationTimer ? 'Stop' : 'Play'}
//             </button>
//         </div>
//     );
// };

// export default WeatherMap;


// import React, { useEffect, useState, useRef } from 'react';
// import maplibre from 'maplibre-gl';
// import axios from 'axios';
// import './WeatherMap.css';

// const WeatherMap = () => {
//     const mapContainer = useRef(null);
//     const [map, setMap] = useState(null);
//     const [weatherData, setWeatherData] = useState(null);
//     const [animationPosition, setAnimationPosition] = useState(0);
//     const [animationTimer, setAnimationTimer] = useState(null);

//     useEffect(() => {
//         axios.get('http://127.0.0.1:8000/api/weather-maps/')
//             .then(response => {
//                 setWeatherData(response.data);
//                 initializeMap(response.data);
//             })
//             .catch(error => {
//                 console.error('Error fetching weather data:', error);
//             });

//         return () => {
//             if (map) map.remove();
//             if (animationTimer) clearTimeout(animationTimer);
//         }
//     }, []);

//     const initializeMap = (data) => {
//         const initialMap = new maplibre.Map({
//             container: mapContainer.current,
//             style: 'https://api.maptiler.com/maps/basic/style.json?key=zSKe702Zq1told0U6bDZ',
//             center: [84.1240, 28.3949], // Centered on Nepal
//             zoom: 6
//         });

//         setMap(initialMap);

//         initialMap.on('load', () => {
//             // Load the first radar or satellite image
//             if (data.radar && data.radar.past.length > 0) {
//                 addLayer(data.radar.past[0].path, initialMap);
//             } else if (data.satellite && data.satellite.infrared.length > 0) {
//                 addLayer(data.satellite.infrared[0].path, initialMap);
//             }
//         });
//     };

//     const addLayer = (framePath, mapInstance) => {
//         if (!mapInstance.getLayer(framePath)) {
//             mapInstance.addSource(framePath, {
//                 type: 'raster',
//                 tiles: [
//                     `https://tilecache.rainviewer.com${framePath}/256/{z}/{x}/{y}/2/1_1.png`
//                 ],
//                 tileSize: 256
//             });

//             mapInstance.addLayer({
//                 id: framePath,
//                 type: 'raster',
//                 source: framePath,
//                 paint: {
//                     'raster-opacity': 0.6
//                 }
//             });
//         }
//     };

//     const changeFrame = (position) => {
//         if (!weatherData) return;

//         let frame;
//         if (weatherData.radar && weatherData.radar.past && weatherData.radar.past.length > position) {
//             frame = weatherData.radar.past[position];
//             addLayer(frame.path, map);
//         } else if (weatherData.satellite && weatherData.satellite.infrared && weatherData.satellite.infrared.length > position) {
//             frame = weatherData.satellite.infrared[position];
//             addLayer(frame.path, map);
//         }

//         if (frame) {
//             setAnimationPosition(position);
//         }
//     };

//     const playAnimation = () => {
//         const nextPosition = (animationPosition + 1) % (weatherData.radar.past.length || weatherData.satellite.infrared.length);
//         changeFrame(nextPosition);
//         setAnimationTimer(setTimeout(playAnimation, 500)); // 500ms interval for animation
//     };

//     const stopAnimation = () => {
//         if (animationTimer) {
//             clearTimeout(animationTimer);
//             setAnimationTimer(null);
//         }
//     };

//     const togglePlayStop = () => {
//         if (animationTimer) {
//             stopAnimation();
//         } else {
//             playAnimation();
//         }
//     };

//     return (
//         <div className="weather-map-container">
//             <div ref={mapContainer} className="map-container" />
//             <div className="controls">
//                 <button onClick={() => changeFrame(animationPosition - 1)}>&lt;</button>
//                 <button onClick={togglePlayStop}>
//                     {animationTimer ? 'Stop' : 'Play'}
//                 </button>
//                 <button onClick={() => changeFrame(animationPosition + 1)}>&gt;</button>
//             </div>
//             <div id="timestamp" className="timestamp">FRAME TIME</div>
//         </div>
//     );
// };

// export default WeatherMap;


import React, { useEffect, useState, useRef } from 'react';
import maplibre from 'maplibre-gl';
import axios from 'axios';
import './WeatherMap.css';

const WeatherMap = () => {
    const mapContainer = useRef(null);
    const [map, setMap] = useState(null);
    const [weatherData, setWeatherData] = useState(null);
    const [animationPosition, setAnimationPosition] = useState(0);
    const [animationTimer, setAnimationTimer] = useState(null);
    const [optionKind, setOptionKind] = useState('radar');
    const [optionColorScheme, setOptionColorScheme] = useState('0');

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/weather-maps/')
            .then(response => {
                setWeatherData(response.data);
                initializeMap(response.data);
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
            });

        return () => {
            if (map) map.remove();
            if (animationTimer) clearTimeout(animationTimer);
        };
    }, []);

    const initializeMap = (data) => {
        const initialMap = new maplibre.Map({
            container: mapContainer.current,
            style: 'https://api.maptiler.com/maps/basic/style.json?key=zSKe702Zq1told0U6bDZ',
            center: [84.1240, 28.3949], // Centered on Nepal
            zoom: 6
        });

        setMap(initialMap);

        initialMap.on('load', () => {
            // Load the first radar or satellite image
            if (data.radar && data.radar.past.length > 0) {
                addLayer(data.radar.past[0].path, initialMap);
            } else if (data.satellite && data.satellite.infrared.length > 0) {
                addLayer(data.satellite.infrared[0].path, initialMap);
            }
        });
    };

    const addLayer = (framePath, mapInstance) => {
        const proxyUrl = `http://localhost:5000/proxy?url=https://tilecache.rainviewer.com${framePath}/256/{z}/{x}/{y}/2/${optionColorScheme}.png`;
        
        if (!mapInstance.getLayer(framePath)) {
            mapInstance.addSource(framePath, {
                type: 'raster',
                tiles: [
                    proxyUrl
                ],
                tileSize: 256
            });

            mapInstance.addLayer({
                id: framePath,
                type: 'raster',
                source: framePath,
                paint: {
                    'raster-opacity': 0.6
                }
            });
        }
    };

    const changeFrame = (position) => {
        if (!weatherData) return;

        let frame;
        if (optionKind === 'radar' && weatherData.radar && weatherData.radar.past.length > position) {
            frame = weatherData.radar.past[position];
        } else if (optionKind === 'satellite' && weatherData.satellite && weatherData.satellite.infrared.length > position) {
            frame = weatherData.satellite.infrared[position];
        }

        if (frame) {
            addLayer(frame.path, map);
            setAnimationPosition(position);
        }
    };

    const playAnimation = () => {
        const nextPosition = (animationPosition + 1) % (weatherData[optionKind]?.past?.length || weatherData.satellite?.infrared?.length || 0);
        changeFrame(nextPosition);
        setAnimationTimer(setTimeout(playAnimation, 500)); // 500ms interval for animation
    };

    const stopAnimation = () => {
        if (animationTimer) {
            clearTimeout(animationTimer);
            setAnimationTimer(null);
        }
    };

    const togglePlayStop = () => {
        if (animationTimer) {
            stopAnimation();
        } else {
            playAnimation();
        }
    };

    const handleKindChange = (kind) => {
        setOptionKind(kind);
        setAnimationPosition(0); // Reset the animation position
        if (map && weatherData) {
            map.getStyle().layers.forEach(layer => {
                if (map.getLayer(layer.id)) {
                    map.removeLayer(layer.id);
                    if (map.getSource(layer.id)) {
                        map.removeSource(layer.id);
                    }
                }
            });
            changeFrame(0); // Load the first frame of the selected kind
        }
    };

    const handleColorSchemeChange = (event) => {
        setOptionColorScheme(event.target.value);
        if (map && weatherData) {
            map.getStyle().layers.forEach(layer => {
                if (map.getLayer(layer.id)) {
                    map.removeLayer(layer.id);
                    if (map.getSource(layer.id)) {
                        map.removeSource(layer.id);
                    }
                }
            });
            changeFrame(animationPosition); // Reload the current frame with the new color scheme
        }
    };

    return (
        <div className="weather-map-container">
            <div ref={mapContainer} className="map-container" />
            <div className="controls">
                <div className="control-item">
                    <input type="radio" name="kind" checked={optionKind === 'radar'} onChange={() => handleKindChange('radar')} />Radar (Past + Future)
                    <input type="radio" name="kind" checked={optionKind === 'satellite'} onChange={() => handleKindChange('satellite')} />Infrared Satellite
                </div>
                <button onClick={() => changeFrame(animationPosition - 1)}>&lt;</button>
                <button onClick={togglePlayStop}>{animationTimer ? 'Stop' : 'Play'}</button>
                <button onClick={() => changeFrame(animationPosition + 1)}>&gt;</button>
                <select id="colors" value={optionColorScheme} onChange={handleColorSchemeChange}>
                    <option value="0">Black and White Values</option>
                    <option value="1">Original</option>
                    <option value="2">Universal Blue</option>
                    <option value="3">TITAN</option>
                    <option value="4">The Weather Channel</option>
                    <option value="5">Meteored</option>
                    <option value="6">NEXRAD Level-III</option>
                    <option value="7">RAINBOW @ SELEX-SI</option>
                    <option value="8">Dark Sky</option>
                </select>
            </div>
            <div id="timestamp" className="timestamp">FRAME TIME</div>
        </div>
    );
};

export default WeatherMap;




