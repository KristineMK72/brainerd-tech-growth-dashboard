import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

// Brainerd coords: 46.3580° N, 94.2008° W
// Tech locations (from local data: Ascensus ~Brainerd, Growth Zone ~Nisswa, etc.)
const techSpots = [
  { position: [46.358, -94.201], name: 'Ascensus (Tech Services, 480 jobs)', info: 'Financial tech hub' },
  { position: [46.371, -94.289], name: 'Growth Zone (Software, 96 jobs)', info: 'Association management tech' },
  { position: [46.352, -94.188], name: 'CTC (Telecom, 60 jobs)', info: 'Communications tech' },
  { position: [46.355, -94.195], name: 'Marco Technologies', info: 'Managed IT services' },
  // Add more or fetch dynamically
];

export default function MapComponent() {
  return (
    <MapContainer center={[46.358, -94.201]} zoom={12} style={{ height: '100%', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {techSpots.map((spot, i) => (
        <Marker key={i} position={spot.position}>
          <Popup>{spot.name}<br />{spot.info}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
