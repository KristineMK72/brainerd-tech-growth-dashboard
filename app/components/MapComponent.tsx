"use client";

import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

// Fix Leaflet marker icons for Next/Vercel
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconRetinaUrl: iconRetinaUrl as unknown as string,
  iconUrl: iconUrl as unknown as string,
  shadowUrl: shadowUrl as unknown as string,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

type Category = "it" | "healthtech" | "education" | "coworking";

type LocationPoint = {
  id: string;
  name: string;
  position: [number, number];
  category: Category;
  note?: string;
};

const center: [number, number] = [46.358, -94.201];

const points: LocationPoint[] = [
  {
    id: "ascensus",
    name: "Brainerd — IT / services",
    position: [46.358, -94.201],
    category: "it",
    note: "Example anchor. Replace/expand with vetted employers + addresses.",
  },
  {
    id: "clc",
    name: "Central Lakes College area",
    position: [46.352, -94.188],
    category: "education",
    note: "Workforce anchor: training, programs, partnerships.",
  },
  {
    id: "pequot",
    name: "Nisswa / Pequot Lakes area",
    position: [46.471, -94.289],
    category: "coworking",
    note: "Example cluster area for remote workers + small firms.",
  },
  {
    id: "health",
    name: "Health / clinical tech hub (example)",
    position: [46.3565, -94.197],
    category: "healthtech",
    note: "Example: hospital/clinic-adjacent IT + health operations.",
  },
];

const categoryStyle: Record<Category, { label: string; color: string }> = {
  it: { label: "IT services", color: "#2563eb" },
  healthtech: { label: "Health tech", color: "#16a34a" },
  education: { label: "Education", color: "#7c3aed" },
  coworking: { label: "Coworking", color: "#f97316" },
};

function iconForCategory(cat: Category) {
  const { color } = categoryStyle[cat];
  return L.divIcon({
    className: "",
    html: `<div style="
      width: 12px; height: 12px; border-radius: 9999px;
      background:${color};
      border: 2px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,.25);
    "></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
}

export default function MapComponent() {
  return (
    <div className="relative h-full w-full">
      <MapContainer center={center} zoom={11} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* Clustering */}
        <MarkerClusterGroup chunkedLoading>
          {points.map((p) => (
            <Marker key={p.id} position={p.position} icon={iconForCategory(p.category)}>
              {/* Hover label */}
              <Tooltip direction="top" offset={[0, -6]} opacity={1} sticky>
                <div className="text-sm font-medium">{p.name}</div>
                <div className="text-xs text-gray-600">{categoryStyle[p.category].label}</div>
              </Tooltip>

              {/* Click detail */}
              <Popup>
                <div style={{ minWidth: 220 }}>
                  <div style={{ fontWeight: 800, marginBottom: 4 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: "#475569", marginBottom: 8 }}>
                    Category: <span style={{ fontWeight: 700 }}>{categoryStyle[p.category].label}</span>
                  </div>
                  {p.note ? (
                    <div style={{ fontSize: 12, color: "#334155", lineHeight: 1.4 }}>{p.note}</div>
                  ) : null}
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      {/* Mini legend */}
      <div className="absolute left-4 bottom-4 bg-white/95 backdrop-blur rounded-xl shadow-lg border border-gray-200 p-4 w-[220px]">
        <div className="font-semibold text-gray-800 mb-2">Tech Activity Legend</div>
        <div className="space-y-2">
          {(Object.keys(categoryStyle) as Category[]).map((k) => (
            <div key={k} className="flex items-center gap-2 text-sm text-gray-700">
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 9999,
                  background: categoryStyle[k].color,
                  border: "2px solid white",
                  boxShadow: "0 1px 6px rgba(0,0,0,.2)",
                }}
              />
              <span>{categoryStyle[k].label}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs text-gray-500">Hover for quick labels • Click for details</div>
      </div>
    </div>
  );
}
