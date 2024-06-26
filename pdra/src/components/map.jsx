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


// import React, { useRef, useEffect } from "react";
// import maplibregl from "maplibre-gl";
// import "maplibre-gl/dist/maplibre-gl.css";
// import * as turf from "@turf/turf";

// const API_KEY = "zSKe702Zq1told0U6bDZ";

// export default function Map() {
//   const mapContainer = useRef(null);
//   const map = useRef(null);
//   const lat = 28.3949;
//   const lng = 84.124;
//   const zoom = 6.5;

//   useEffect(() => {
//     if (map.current) return; // stops map from initializing more than once

//     map.current = new maplibregl.Map({
//       container: mapContainer.current,
//       style: `https://api.maptiler.com/maps/basic-v2/style.json?key=${API_KEY}`,
//       center: [lng, lat],
//       zoom: zoom,
//     });

//     map.current.addControl(new maplibregl.NavigationControl(), "top-right");
//   }, [lng, lat, zoom]);

//   return (
//     <div className="map-wrap" style={{ display: "flex", height: "100vh"}}>
//       <div style={{ width: "20%", backgroundColor: "black" }} />
//       <div style={{ width: "80%" }}>
//         <div ref={mapContainer} className="map" style={{ width: "100%", height: "100%" }} />
//       </div>
//     </div>
//   );
// }




// /* global map */
// import React, { useRef, useEffect, useState } from "react";
// import maplibregl from "maplibre-gl";
// import "maplibre-gl/dist/maplibre-gl.css";
// import $ from "jquery"; // Import jQuery if not already imported



// export default function Map() {
//   const mapContainer = useRef(null);
//   const [wardGeojson, setWardGeojson] = useState(null);
//   const [provinceOptions, setProvinceOptions] = useState([]);
//   const [districtOptions, setDistrictOptions] = useState([]);
//   const [municipalityOptions, setMunicipalityOptions] = useState([]);
//   const [wardOptions, setWardOptions] = useState([]);

//   useEffect(() => {
//     /* global map */
//     const map = new maplibregl.Map({
//       container: mapContainer.current,
//       style: "https://api.maptiler.com/maps/basic-v2/style.json?key=${API_KEY}", // Replace with your Maptiler style URL
//       center: [84.124, 28.3949],
//       zoom: 7,
//     });

//     map.addControl(new maplibregl.NavigationControl(), "top-right");

//     return () => map.remove(); // Clean up map instance on unmount
//   }, []);

//   const handleWardFormSubmit = (event) => {
//     event.preventDefault();
//     const wardId = $('#ward').val();
//     if (!wardId) {
//       alert("Please select a ward.");
//       return;
//     }
//     $.ajax({
//       type: 'GET',
//       url: `${API_BASE_URL}/api/ward-geojson/${wardId}/`, // Adjust API endpoint as needed
//       success: function(response) {
//         setWardGeojson(response);
//         const bounds = new maplibregl.LngLatBounds();
//         bounds.extend(response.features[0].geometry.coordinates); // Assuming response is GeoJSON FeatureCollection
//         map.fitBounds(bounds, { padding: 20 });
//       },
//       error: function(error) {
//         console.log(error);
//         alert('Error fetching ward data. Check the console for more details.');
//       }
//     });
//   };

//   const handleProvinceChange = (event) => {
//     const provinceId = event.target.value;
//     $.ajax({
//       url: `${API_BASE_URL}/api/districts/?province=${provinceId}`, // Adjust API endpoint as needed
//       type: 'GET',
//       success: function(response) {
//         setDistrictOptions(response);
//       },
//       error: function(error) {
//         console.log(error);
//       }
//     });
//   };

//   const handleDistrictChange = (event) => {
//     const districtId = event.target.value;
//     $.ajax({
//       url: `${API_BASE_URL}/api/municipalities/?district=${districtId}`, // Adjust API endpoint as needed
//       type: 'GET',
//       success: function(response) {
//         setMunicipalityOptions(response);
//       },
//       error: function(error) {
//         console.log(error);
//       }
//     });
//   };

//   const handleMunicipalityChange = (event) => {
//     const municipalityId = event.target.value;
//     $.ajax({
//       url: `${API_BASE_URL}/api/wards/?municipality=${municipalityId}`, // Adjust API endpoint as needed
//       type: 'GET',
//       success: function(response) {
//         setWardOptions(response);
//       },
//       error: function(error) {
//         console.log(error);
//       }
//     });
//   };

//   return (
//     <div style={{ display: "flex", height: "100%" }}>
//       <div style={{ width: "20%", backgroundColor: "black", color: "white", padding: "20px" }}>
//         <h2>Select Ward</h2>
//         <form id="wardForm" onSubmit={handleWardFormSubmit}>
//           <label htmlFor="province">Province:</label>
//           <select id="province" name="province" onChange={handleProvinceChange}>
//             <option value="">Select Province</option>
//             {provinceOptions.map(province => (
//               <option key={province.id} value={province.id}>{province.name}</option>
//             ))}
//           </select><br /><br />

//           <label htmlFor="district">District:</label>
//           <select id="district" name="district" onChange={handleDistrictChange}>
//             <option value="">Select District</option>
//             {districtOptions.map(district => (
//               <option key={district.id} value={district.id}>{district.name}</option>
//             ))}
//           </select><br /><br />

//           <label htmlFor="municipality">Municipality:</label>
//           <select id="municipality" name="municipality" onChange={handleMunicipalityChange}>
//             <option value="">Select Municipality</option>
//             {municipalityOptions.map(municipality => (
//               <option key={municipality.id} value={municipality.id}>{municipality.name}</option>
//             ))}
//           </select><br /><br />

//           <label htmlFor="ward">Ward:</label>
//           <select id="ward" name="ward">
//             <option value="">Select Ward</option>
//             {wardOptions.map(ward => (
//               <option key={ward.id} value={ward.id}>{ward.name}</option>
//             ))}
//           </select><br /><br />

//           <button type="submit">Get Ward GeoJSON</button>
//         </form>
//       </div>

//       <div style={{ width: "80%" }}>
//         <div id="map" ref={mapContainer} style={{ height: "100%", width: "100%" }} />
//       </div>

//       <div id="geojsonResult">
//         {wardGeojson && (
//           <pre>{JSON.stringify(wardGeojson, null, 2)}</pre>
//         )}
//       </div>
//     </div>
//   );
// }





// import React, { useRef, useEffect, useState } from "react";
// import maplibregl from "maplibre-gl";
// import "maplibre-gl/dist/maplibre-gl.css";
// import $ from 'jquery';


// const API_BASE_URL = "http://127.0.0.1:8000"; // Replace with your API base URL
// const API_KEY = "zSKe702Zq1told0U6bDZ";



// export default function Map() {
//   const mapContainer = useRef(null);
//   const mapRef = useRef(null); // Use useRef to hold the map instance
//   const [wardGeojson, setWardGeojson] = useState(null);
//   const [provinceOptions, setProvinceOptions] = useState([]);
//   const [districtOptions, setDistrictOptions] = useState([]);
//   const [municipalityOptions, setMunicipalityOptions] = useState([]);
//   const [wardOptions, setWardOptions] = useState([]);

//   useEffect(() => {
//     mapRef.current = new maplibregl.Map({
//       container: mapContainer.current,
//       style: `https://api.maptiler.com/maps/basic-v2/style.json?key=${API_KEY}`,// Replace with your Maptiler style URL
//       center: [84.124, 28.3949],
//       zoom: 7,
//     });

//     mapRef.current.addControl(new maplibregl.NavigationControl(), "top-right");

//     return () => mapRef.current.remove(); // Clean up map instance on unmount
//   }, []);

//   const handleWardFormSubmit = (event) => {
//     event.preventDefault();
//     const wardId = $('#ward').val();
//     if (!wardId) {
//       alert("Please select a ward.");
//       return;
//     }
//     $.ajax({
//       type: 'GET',
//       url: `${API_BASE_URL}/api/ward-geojson/${wardId}/`, // Adjust API endpoint as needed
//       success: function(response) {
//         setWardGeojson(response);
//         const bounds = new maplibregl.LngLatBounds();
//         response.features.forEach(feature => bounds.extend(feature.geometry.coordinates)); // Assuming response is GeoJSON FeatureCollection
//         mapRef.current.fitBounds(bounds, { padding: 20 });
//       },
//       error: function(error) {
//         console.log(error);
//         alert('Error fetching ward data. Check the console for more details.');
//       }
//     });
//   };

//   const handleProvinceChange = (event) => {
//     const provinceId = event.target.value;
//     $.ajax({
//       url: `${API_BASE_URL}/api/districts/?province=${provinceId}`, // Adjust API endpoint as needed
//       type: 'GET',
//       success: function(response) {
//         setDistrictOptions(response);
//       },
//       error: function(error) {
//         console.log(error);
//       }
//     });
//   };

//   const handleDistrictChange = (event) => {
//     const districtId = event.target.value;
//     $.ajax({
//       url: `${API_BASE_URL}/api/municipalities/?district=${districtId}`, // Adjust API endpoint as needed
//       type: 'GET',
//       success: function(response) {
//         setMunicipalityOptions(response);
//       },
//       error: function(error) {
//         console.log(error);
//       }
//     });
//   };

//   const handleMunicipalityChange = (event) => {
//     const municipalityId = event.target.value;
//     $.ajax({
//       url: `${API_BASE_URL}/api/wards/?municipality=${municipalityId}`, // Adjust API endpoint as needed
//       type: 'GET',
//       success: function(response) {
//         setWardOptions(response);
//       },
//       error: function(error) {
//         console.log(error);
//       }
//     });
//   };

//   return (
//     <div style={{ display: "flex", height: "100%" }}>
//       <div style={{ width: "20%", backgroundColor: "black", color: "white", padding: "20px" }}>
//         <h2>Select Ward</h2>
//         <form id="wardForm" onSubmit={handleWardFormSubmit}>
//           <label htmlFor="province">Province:</label>
//           <select id="province" name="province" onChange={handleProvinceChange}>
//             <option value="">Select Province</option>
//             {provinceOptions.map(province => (
//               <option key={province.id} value={province.id}>{province.name}</option>
//             ))}
//           </select><br /><br />

//           <label htmlFor="district">District:</label>
//           <select id="district" name="district" onChange={handleDistrictChange}>
//             <option value="">Select District</option>
//             {districtOptions.map(district => (
//               <option key={district.id} value={district.id}>{district.name}</option>
//             ))}
//           </select><br /><br />

//           <label htmlFor="municipality">Municipality:</label>
//           <select id="municipality" name="municipality" onChange={handleMunicipalityChange}>
//             <option value="">Select Municipality</option>
//             {municipalityOptions.map(municipality => (
//               <option key={municipality.id} value={municipality.id}>{municipality.name}</option>
//             ))}
//           </select><br /><br />

//           <label htmlFor="ward">Ward:</label>
//           <select id="ward" name="ward">
//             <option value="">Select Ward</option>
//             {wardOptions.map(ward => (
//               <option key={ward.id} value={ward.id}>{ward.name}</option>
//             ))}
//           </select><br /><br />

//           <button type="submit">Get Ward GeoJSON</button>
//         </form>
//       </div>

//       <div style={{ width: "80%" }}>
//         <div id="map" ref={mapContainer} style={{ height: "100%", width: "100%" }} />
//       </div>

//       <div id="geojsonResult">
//         {wardGeojson && (
//           <pre>{JSON.stringify(wardGeojson, null, 2)}</pre>
//         )}
//       </div>
//     </div>
//   );
// }








// The map is working okey

  
// import React, { useRef, useEffect, useState } from "react";
// import maplibregl from "maplibre-gl";
// import "maplibre-gl/dist/maplibre-gl.css";
// import './map.css'; 

// const API_BASE_URL = "http://127.0.0.1:8000"; // Replace with your API base URL
// const API_KEY = "zSKe702Zq1told0U6bDZ";

// export default function Map() {
//   const mapContainer = useRef(null);
//   const mapRef = useRef(null);
//   const [provinceOptions, setProvinceOptions] = useState([]);
//   const [districtOptions, setDistrictOptions] = useState([]);
//   const [municipalityOptions, setMunicipalityOptions] = useState([]);
//   const [wardOptions, setWardOptions] = useState([]);

//   useEffect(() => {
//     mapRef.current = new maplibregl.Map({
//       container: mapContainer.current,
//       style: `https://api.maptiler.com/maps/basic-v2/style.json?key=${API_KEY}`,
//       center: [84.124, 28.3949],
//       zoom: 7,
//     });

//     mapRef.current.addControl(new maplibregl.NavigationControl(), "top-right");

//     // Fetch provinces on component mount
//     fetch(`${API_BASE_URL}/api/provinces/`)
//       .then(response => response.json())
//       .then(data => setProvinceOptions(data))
//       .catch(error => console.log(error));

//     return () => mapRef.current.remove();
//   }, []);

//   const handleWardFormSubmit = async (event) => {
//     event.preventDefault();
//     const wardId = document.getElementById('ward').value;
//     if (!wardId) {
//       alert("Please select a ward.");
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/api/ward-geojson/${wardId}/`);
//       const data = await response.json();

//       if (data && data.type === "MultiPolygon" && Array.isArray(data.coordinates)) {
//         const geojsonSource = {
//           type: 'geojson',
//           data: data
//         };

//         // Remove existing ward layer and source if they exist
//         if (mapRef.current.getSource('ward')) {
//           mapRef.current.removeLayer('ward');
//           mapRef.current.removeSource('ward');
//         }

//         // Add the new ward source and layer
//         mapRef.current.addSource('ward', geojsonSource);
//         mapRef.current.addLayer({
//           id: 'ward',
//           type: 'fill',
//           source: 'ward',
//           paint: {
//             'fill-color': '#088',
//             'fill-opacity': 0.4,
         
//           }
//         });

//         // Fit map to ward bounds
//         const bounds = new maplibregl.LngLatBounds();
//         data.coordinates.forEach(polygon => {
//           polygon.forEach(ring => {
//             ring.forEach(coord => {
//               bounds.extend(coord);
//             });
//           });
//         });
//         mapRef.current.fitBounds(bounds, { padding: 20 });
//       } else {
//         alert('Invalid GeoJSON data.');
//       }
//     } catch (error) {
//       console.log(error);
//       alert('Error fetching ward data. Check the console for more details.');
//     }
//   };

//   const handleProvinceChange = async (event) => {
//     const provinceId = event.target.value;
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/districts/?province=${provinceId}`);
//       const data = await response.json();
//       setDistrictOptions(data);
//       setMunicipalityOptions([]);
//       setWardOptions([]);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleDistrictChange = async (event) => {
//     const districtId = event.target.value;
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/municipalities/?district=${districtId}`);
//       const data = await response.json();
//       setMunicipalityOptions(data);
//       setWardOptions([]);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleMunicipalityChange = async (event) => {
//     const municipalityId = event.target.value;
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/wards/?municipality=${municipalityId}`);
//       const data = await response.json();
//       setWardOptions(data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div style={{ display: "flex", height: "100%" }}>
//       <div style={{ width: "20%", backgroundColor: "black", color: "white", padding: "20px" }}>
//         <h2>Select Ward</h2>
//         <form id="wardForm" onSubmit={handleWardFormSubmit}>
//           <label htmlFor="province">Province:</label>
//           <select id="province" name="province" onChange={handleProvinceChange}>
//             <option value="">Select Province</option>
//             {provinceOptions.map(province => (
//               <option key={province.id} value={province.id}>{province.name}</option>
//             ))}
//           </select><br /><br />

//           <label htmlFor="district">District:</label>
//           <select id="district" name="district" onChange={handleDistrictChange}>
//             <option value="">Select District</option>
//             {districtOptions.map(district => (
//               <option key={district.id} value={district.id}>{district.name}</option>
//             ))}
//           </select><br /><br />

//           <label htmlFor="municipality">Municipality:</label>
//           <select id="municipality" name="municipality" onChange={handleMunicipalityChange}>
//             <option value="">Select Municipality</option>
//             {municipalityOptions.map(municipality => (
//               <option key={municipality.id} value={municipality.id}>{municipality.name}</option>
//             ))}
//           </select><br /><br />

//           <label htmlFor="ward">Ward:</label>
//           <select id="ward" name="ward">
//             <option value="">Select Ward</option>
//             {wardOptions.map(ward => (
//               <option key={ward.id} value={ward.id}>{ward.name}</option>
//             ))}
//           </select><br /><br />

//           <button type="submit">Get Ward GeoJSON</button>
//         </form>
//       </div>

//       <div style={{ width: "80%" }}>
//         <div id="map" ref={mapContainer} style={{ height: "100%", width: "100%" }} />
//       </div>
//     </div>
//   );
// }


// Flooe=d zones added to the map



// import React, { useRef, useEffect, useState } from "react";
// import maplibregl from "maplibre-gl";
// import "maplibre-gl/dist/maplibre-gl.css";
// import './map.css'; 

// const API_BASE_URL = "http://127.0.0.1:8000"; // Replace with your API base URL
// const API_KEY = "zSKe702Zq1told0U6bDZ";

// export default function Map() {
//   const mapContainer = useRef(null);
//   const mapRef = useRef(null);
//   const [provinceOptions, setProvinceOptions] = useState([]);
//   const [districtOptions, setDistrictOptions] = useState([]);
//   const [municipalityOptions, setMunicipalityOptions] = useState([]);
//   const [wardOptions, setWardOptions] = useState([]);

//   useEffect(() => {
//     mapRef.current = new maplibregl.Map({
//       container: mapContainer.current,
//       style: `https://api.maptiler.com/maps/basic-v2/style.json?key=${API_KEY}`,
//       center: [84.124, 28.3949],
//       zoom: 7,
//     });

//     mapRef.current.addControl(new maplibregl.NavigationControl(), "top-right");

//     // Fetch provinces on component mount
//     fetch(`${API_BASE_URL}/api/provinces/`)
//       .then(response => response.json())
//       .then(data => setProvinceOptions(data))
//       .catch(error => console.log(error));

//     // Fetch and add flood zones
//     fetchFloodZones();

//     return () => mapRef.current.remove();
//   }, []);

//   const fetchFloodZones = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/flood-zones/`);
//       const data = await response.json();

//       if (data && data.type === "FeatureCollection" && data.features.length > 0) {
//         // Add flood zones to the map
//         mapRef.current.addSource('flood-zones', {
//           type: 'geojson',
//           data: data
//         });

//         mapRef.current.addLayer({
//           id: 'flood-zones',
//           type: 'fill',
//           source: 'flood-zones',
//           paint: {
//             'fill-color': '#FF0000',
//             'fill-opacity': 0.5
//           }
//         });
//       } else {
//         console.error('Invalid or empty flood zone data.');
//       }
//     } catch (error) {
//       console.error('Error fetching flood zones:', error);
//     }
//   };

//   const handleWardFormSubmit = async (event) => {
//     event.preventDefault();
//     const wardId = document.getElementById('ward').value;
//     if (!wardId) {
//       alert("Please select a ward.");
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/api/ward-geojson/${wardId}/`);
//       const data = await response.json();

//       if (data && data.type === "MultiPolygon" && Array.isArray(data.coordinates)) {
//         const geojsonSource = {
//           type: 'geojson',
//           data: data
//         };

//         // Remove existing ward layer and source if they exist
//         if (mapRef.current.getSource('ward')) {
//           mapRef.current.removeLayer('ward');
//           mapRef.current.removeSource('ward');
//         }

//         // Add the new ward source and layer
//         mapRef.current.addSource('ward', geojsonSource);
//         mapRef.current.addLayer({
//           id: 'ward',
//           type: 'fill',
//           source: 'ward',
//           paint: {
//             'fill-color': '#088',
//             'fill-opacity': 0.4
//           }
//         });

//         // Fit map to ward bounds
//         const bounds = new maplibregl.LngLatBounds();
//         data.coordinates.forEach(polygon => {
//           polygon.forEach(ring => {
//             ring.forEach(coord => {
//               bounds.extend(coord);
//             });
//           });
//         });
//         mapRef.current.fitBounds(bounds, { padding: 20 });
//       } else {
//         alert('Invalid GeoJSON data.');
//       }
//     } catch (error) {
//       console.log(error);
//       alert('Error fetching ward data. Check the console for more details.');
//     }
//   };

//   const handleProvinceChange = async (event) => {
//     const provinceId = event.target.value;
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/districts/?province=${provinceId}`);
//       const data = await response.json();
//       setDistrictOptions(data);
//       setMunicipalityOptions([]);
//       setWardOptions([]);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleDistrictChange = async (event) => {
//     const districtId = event.target.value;
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/municipalities/?district=${districtId}`);
//       const data = await response.json();
//       setMunicipalityOptions(data);
//       setWardOptions([]);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleMunicipalityChange = async (event) => {
//     const municipalityId = event.target.value;
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/wards/?municipality=${municipalityId}`);
//       const data = await response.json();
//       setWardOptions(data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div style={{ display: "flex", height: "100%" }}>
//       <div style={{ width: "20%", backgroundColor: "black", color: "white", padding: "20px" }}>
//         <h2>Select Ward</h2>
//         <form id="wardForm" onSubmit={handleWardFormSubmit}>
//           <label htmlFor="province">Province:</label>
//           <select id="province" name="province" onChange={handleProvinceChange}>
//             <option value="">Select Province</option>
//             {provinceOptions.map(province => (
//               <option key={province.id} value={province.id}>{province.name}</option>
//             ))}
//           </select><br /><br />

//           <label htmlFor="district">District:</label>
//           <select id="district" name="district" onChange={handleDistrictChange}>
//             <option value="">Select District</option>
//             {districtOptions.map(district => (
//               <option key={district.id} value={district.id}>{district.name}</option>
//             ))}
//           </select><br /><br />

//           <label htmlFor="municipality">Municipality:</label>
//           <select id="municipality" name="municipality" onChange={handleMunicipalityChange}>
//             <option value="">Select Municipality</option>
//             {municipalityOptions.map(municipality => (
//               <option key={municipality.id} value={municipality.id}>{municipality.name}</option>
//             ))}
//           </select><br /><br />

//           <label htmlFor="ward">Ward:</label>
//           <select id="ward" name="ward">
//             <option value="">Select Ward</option>
//             {wardOptions.map(ward => (
//               <option key={ward.id} value={ward.id}>{ward.name}</option>
//             ))}
//           </select><br /><br />

//           <button type="submit">Get Ward GeoJSON</button>
//         </form>
//       </div>

//       <div style={{ width: "80%" }}>
//         <div id="map" ref={mapContainer} style={{ height: "100%", width: "100%" }} />
//       </div>
//     </div>
//   );
// }


import React, { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import './map.css'; 

const API_BASE_URL = "http://127.0.0.1:8000"; // Replace with your API base URL
const API_KEY = "zSKe702Zq1told0U6bDZ";

// Legend items with color and label for different flood classifications
const legendItems = [
  { color: '#0000FF', label: 'न्यून डुबान' },   // Blue
  { color: '#FFA500', label: 'मध्यम डुबान' }, // Orange
  { color: '#FF0000', label: 'उच्च डुबान' },   // Red
  { color: '#FF007F', label: 'अति उच्च डुबान' } // Pink
];

export default function Map() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [municipalityOptions, setMunicipalityOptions] = useState([]);
  const [wardOptions, setWardOptions] = useState([]);

  useEffect(() => {
    mapRef.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/basic-v2/style.json?key=${API_KEY}`,
      center: [84.124, 28.3949],
      zoom: 7,
    });

    mapRef.current.addControl(new maplibregl.NavigationControl(), "top-right");

    // Fetch provinces on component mount
    fetch(`${API_BASE_URL}/api/provinces/`)
      .then(response => response.json())
      .then(data => setProvinceOptions(data))
      .catch(error => console.log(error));

    // Fetch and add flood zones
    fetchFloodZones();

    return () => mapRef.current.remove();
  }, []);

  const fetchFloodZones = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/flood-zones/`);
      const data = await response.json();

      if (data && data.type === "FeatureCollection" && data.features.length > 0) {
        // Add flood zones to the map
        mapRef.current.addSource('flood-zones', {
          type: 'geojson',
          data: data
        });

        mapRef.current.addLayer({
          id: 'flood-zones',
          type: 'fill',
          source: 'flood-zones',
          paint: {
            'fill-color': [
              'match',
              ['get', 'classification'],
              'shallow', legendItems[0].color,
              'medium', legendItems[1].color,
              'high', legendItems[2].color,
              'very_high', legendItems[3].color,
              '#000000' // fallback color if classification doesn't match
            ],
            'fill-opacity': 0.5
          }
        });

        // Add legend
        addLegend();
      } else {
        console.error('Invalid or empty flood zone data.');
      }
    } catch (error) {
      console.error('Error fetching flood zones:', error);
    }
  };

  const addLegend = () => {
    const legend = document.createElement('div');
    legend.className = 'map-legend';

    legendItems.forEach(item => {
      const div = document.createElement('div');
      div.innerHTML = `<span class="legend-color" style="background-color: ${item.color}"></span>${item.label}`;
      legend.appendChild(div);
    });

    mapContainer.current.appendChild(legend);
  };

  const handleWardFormSubmit = async (event) => {
    event.preventDefault();
    const wardId = document.getElementById('ward').value;
    if (!wardId) {
      alert("Please select a ward.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/ward-geojson/${wardId}/`);
      const data = await response.json();

      if (data && data.type === "MultiPolygon" && Array.isArray(data.coordinates)) {
        const geojsonSource = {
          type: 'geojson',
          data: data
        };

        // Remove existing ward layer and source if they exist
        if (mapRef.current.getSource('ward')) {
          mapRef.current.removeLayer('ward');
          mapRef.current.removeSource('ward');
        }

        // Add the new ward source and layer
        mapRef.current.addSource('ward', geojsonSource);
        mapRef.current.addLayer({
          id: 'ward',
          type: 'fill',
          source: 'ward',
          paint: {
            'fill-color': '#088',
            'fill-opacity': 0
  
          }

        
        });

        mapRef.current.addLayer({
          id: 'ward-border',
          type: 'line',
          source: 'ward',
          paint: {
              'line-color': '#000000',  // Border color black
              'line-width': 2           // Border thickness
          }
      });

        // Fit map to ward bounds
        const bounds = new maplibregl.LngLatBounds();
        data.coordinates.forEach(polygon => {
          polygon.forEach(ring => {
            ring.forEach(coord => {
              bounds.extend(coord);
            });
          });
        });
        mapRef.current.fitBounds(bounds, { padding: 20 });
      } else {
        alert('Invalid GeoJSON data.');
      }
    } catch (error) {
      console.log(error);
      alert('Error fetching ward data. Check the console for more details.');
    }
  };

  const handleProvinceChange = async (event) => {
    const provinceId = event.target.value;
    try {
      const response = await fetch(`${API_BASE_URL}/api/districts/?province=${provinceId}`);
      const data = await response.json();
      setDistrictOptions(data);
      setMunicipalityOptions([]);
      setWardOptions([]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDistrictChange = async (event) => {
    const districtId = event.target.value;
    try {
      const response = await fetch(`${API_BASE_URL}/api/municipalities/?district=${districtId}`);
      const data = await response.json();
      setMunicipalityOptions(data);
      setWardOptions([]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMunicipalityChange = async (event) => {
    const municipalityId = event.target.value;
    try {
      const response = await fetch(`${API_BASE_URL}/api/wards/?municipality=${municipalityId}`);
      const data = await response.json();
      setWardOptions(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div style={{ width: "20%", backgroundColor: "black", color: "white", padding: "20px" }}>
        <h2>Select Ward</h2>
        <form id="wardForm" onSubmit={handleWardFormSubmit}>
          <label htmlFor="province">Province:</label>
          <select id="province" name="province" onChange={handleProvinceChange}>
            <option value="">Select Province</option>
            {provinceOptions.map(province => (
              <option key={province.id} value={province.id}>{province.name}</option>
            ))}
          </select><br /><br />

          <label htmlFor="district">District:</label>
          <select id="district" name="district" onChange={handleDistrictChange}>
            <option value="">Select District</option>
            {districtOptions.map(district => (
              <option key={district.id} value={district.id}>{district.name}</option>
            ))}
          </select><br /><br />

          <label htmlFor="municipality">Municipality:</label>
          <select id="municipality" name="municipality" onChange={handleMunicipalityChange}>
            <option value="">Select Municipality</option>
            {municipalityOptions.map(municipality => (
              <option key={municipality.id} value={municipality.id}>{municipality.name}</option>
            ))}
          </select><br /><br />

          <label htmlFor="ward">Ward:</label>
          <select id="ward" name="ward">
            <option value="">Select Ward</option>
            {wardOptions.map(ward => (
              <option key={ward.id} value={ward.id}>{ward.name}</option>
            ))}
          </select><br /><br />

          <button type="submit">Get Ward GeoJSON</button>
        </form>
      </div>

      <div style={{ width: "80%", position: "relative" }}>
        <div id="map" ref={mapContainer} style={{ height: "100%", width: "100%" }} />

        {/* Legend */}
        <div className="map-legend" style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'white', padding: '10px', borderRadius: '5px', boxShadow: '0 0 10px rgba(0,0,0,0.3)' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>Legend</h3>
          {legendItems.map((item, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
              <div className="legend-color" style={{ width: '20px', height: '10px', backgroundColor: item.color, marginRight: '10px', border: '1px solid #ccc' }}></div>
              <div>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


