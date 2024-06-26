import React, { useEffect, useState, useRef } from 'react';
import { Map, Source, Layer } from 'react-map-gl';
import axios from 'axios';

const BuildingCom = ({ wardCoordinates }) => {
  const [buildings, setBuildings] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const fetchBuildings = async () => {
      // Construct Overpass API query
      const overpassQuery = `
        [out:json];
        (
          way["building"](poly:"${wardCoordinates.join(' ')}");
        );
        out body;
        >;
        out skel qt;
      `;
      
      const response = await axios.get('https://overpass-api.de/api/interpreter', {
        params: { data: overpassQuery }
      });

      // Convert Overpass response to GeoJSON
      const geojson = osmtogeojson(response.data);
      setBuildings(geojson);
    };

    fetchBuildings();
  }, [wardCoordinates]);

  return (
    <Map
      ref={mapRef}
      initialViewState={{
        longitude: wardCoordinates[0][0], // Center the map based on the ward coordinates
        latitude: wardCoordinates[0][1],
        zoom: 13
      }}
      style={{ width: '100%', height: '100%' }}
      mapStyle="https://demotiles.maplibre.org/style.json"
    >
      {buildings && (
        <Source id="buildings" type="geojson" data={buildings}>
          <Layer
            id="building-layer"
            type="fill"
            paint={{
              'fill-color': '#888',
              'fill-opacity': 0.4
            }}
          />
          <Layer
            id="building-border"
            type="line"
            paint={{
              'line-color': '#000',
              'line-width': 2
            }}
          />
        </Source>
      )}
    </Map>
  );
};

export default BuildingCom;
