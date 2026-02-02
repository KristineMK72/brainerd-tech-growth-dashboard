"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// 🔧 Fix Leaflet default marker icons for Next.js / Vercel
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

// Center on Brainerd
const center: [number, number] = [46.358, -94.201];

const locations: { position: [number, number]; name: string }[] = [
  {
    position: [46.358, -94.201],
    name: "Brainerd – Ascensus & other tech services",
  },
  {
    position: [46.471, -94.289],
    name: "Nisswa / Pequot Lakes area",
  },
  {
    position: [46.352, -94.188],
    name: "Downtown Brainerd / Central Lakes College",
  },
];

export default function MapComponent() {
  return (
    <MapContainer
      center={center}
      zoom={11}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {locations.map((loc, i) => (
        <Marker key={i} position={loc.position}>
          <Popup>{loc.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
