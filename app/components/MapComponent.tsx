"use client";

import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";

// Fix Leaflet marker icons for Next/Vercel
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

type TechCategory = "IT services" | "Health tech" | "Education" | "Coworking";

type Location = {
  position: [number, number];
  name: string;
  category: TechCategory;
  note?: string;
};

const center: [number, number] = [46.358, -94.201];

const locations: Location[] = [
  {
    position: [46.358, -94.201],
    name: "Brainerd – IT & business services",
    category: "IT services",
    note: "Example: managed IT, software services, back-office tech.",
  },
  {
    position: [46.352, -94.188],
    name: "Central Lakes College area",
    category: "Education",
    note: "Workforce pipeline + upskilling.",
  },
  {
    position: [46.471, -94.289],
    name: "Nisswa / Pequot Lakes area",
    category: "Coworking",
    note: "Remote work / small studio potential.",
  },
];

const CATEGORY_COLORS: Record<TechCategory, string> = {
  "IT services": "#2563eb", // blue
  "Health tech": "#16a34a", // green
  Education: "#9333ea", // purple
  Coworking: "#f97316", // orange
};

function iconFor(category: TechCategory) {
  return L.divIcon({
    className: "tech-pin",
    html: `<div style="
      width: 14px; height: 14px; border-radius: 999px;
      background: ${CATEGORY_COLORS[category]};
      border: 2px solid white;
      box-shadow: 0 6px 14px rgba(0,0,0,.18);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

function Legend() {
  return (
    <div
      className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur
                 rounded-xl border border-gray-200 shadow-md p-3"
    >
      <div className="text-xs font-semibold text-gray-800 mb-2">
        Tech Activity Legend
      </div>
      <div className="space-y-1">
        {(Object.keys(CATEGORY_COLORS) as TechCategory[]).map((cat) => (
          <div key={cat} className="flex items-center gap-2 text-xs text-gray-700">
            <span
              style={{ background: CATEGORY_COLORS[cat] }}
              className="inline-block w-3 h-3 rounded-full border border-white shadow"
            />
            <span>{cat}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 text-[11px] text-gray-500">
        Hover for quick labels • Click for details
      </div>
    </div>
  );
}

export default function MapComponent() {
  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={center}
        zoom={11}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Clustering */}
        <MarkerClusterGroup
          chunkedLoading
          showCoverageOnHover={false}
          spiderfyOnMaxZoom={true}
        >
          {locations.map((loc, i) => (
            <Marker key={i} position={loc.position} icon={iconFor(loc.category)}>
              {/* Hover tooltip */}
              <Tooltip direction="top" offset={[0, -10]} opacity={1} sticky>
                <div className="text-xs font-medium">{loc.name}</div>
                <div className="text-[11px] text-gray-600">{loc.category}</div>
              </Tooltip>

              {/* Click popup */}
              <Popup>
                <div className="space-y-1">
                  <div className="font-semibold">{loc.name}</div>
                  <div className="text-sm text-gray-700">{loc.category}</div>
                  {loc.note && <div className="text-sm text-gray-600">{loc.note}</div>}
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      <Legend />
    </div>
  );
}
