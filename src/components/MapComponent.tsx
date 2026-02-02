'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

// Center on Brainerd
const center: [number, number] = [46.358, -94.201];

const locations = [
  { position: [46.358, -94.201] as [number, number], name: 'Brainerd – Ascensus & other tech services' },
  { position: [46.471, -94.289] as [number, number], name: 'Nisswa / Pequot Lakes area' },
  { position: [46.352, -94.188] as [number, number], name: 'Downtown Brainerd / Central Lakes College' },
];

export default function MapComponent() {
  return (
    <MapContainer center={center} zoom={11} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {locations.map((loc, i) => (
        <Marker key={i} position={loc.position}>
          <Popup>{loc.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
