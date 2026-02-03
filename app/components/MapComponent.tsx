"use client";

import { MapContainer, TileLayer, Marker, Popup, Tooltip, Circle, Polyline } from "react-leaflet";
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
type MarkerKind = "activity" | "anchor";

type Location = {
  position: [number, number];
  name: string;
  category: TechCategory;
  kind?: MarkerKind;
  note?: string;
};

const center: [number, number] = [46.358, -94.201];

// Activity points (curated examples)
const activityLocations: Location[] = [
  {
    position: [46.358, -94.201],
    name: "Brainerd – IT & business services",
    category: "IT services",
    kind: "activity",
    note: "Example: managed IT, software services, back-office tech.",
  },
  {
    position: [46.352, -94.188],
    name: "Central Lakes College area",
    category: "Education",
    kind: "activity",
    note: "Workforce pipeline + upskilling.",
  },
  {
    position: [46.471, -94.289],
    name: "Nisswa / Pequot Lakes area",
    category: "Coworking",
    kind: "activity",
    note: "Remote work / small studio potential.",
  },
];

// Workforce anchors (these make the map decision-grade)
const anchors: Location[] = [
  {
    position: [46.352, -94.188],
    name: "Central Lakes College (anchor)",
    category: "Education",
    kind: "anchor",
    note: "Training pipeline: IT / CIS / workforce programs.",
  },
  {
    position: [46.358, -94.201],
    name: "City/County services (anchor)",
    category: "IT services",
    kind: "anchor",
    note: "Municipal IT + public services tech roles.",
  },
  // Add hospitals/major employers as you want:
  // { position: [..,..], name: "Hospital (anchor)", category: "Health tech", kind: "anchor", note: "Healthcare IT roles." },
];

const CATEGORY_COLORS: Record<TechCategory, string> = {
  "IT services": "#2563eb",
  "Health tech": "#16a34a",
  Education: "#9333ea",
  Coworking: "#f97316",
};

function iconFor(category: TechCategory, kind: MarkerKind = "activity") {
  const fill = CATEGORY_COLORS[category];
  const ring = kind === "anchor" ? "#111827" : "white"; // anchors get a darker ring
  const size = kind === "anchor" ? 16 : 14;

  return L.divIcon({
    className: "tech-pin",
    html: `<div style="
      width: ${size}px; height: ${size}px; border-radius: 999px;
      background: ${fill};
      border: 2px solid ${ring};
      box-shadow: 0 6px 14px rgba(0,0,0,.18);
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function Legend() {
  return (
    <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur rounded-xl border border-gray-200 shadow-md p-3">
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

      <div className="mt-2 pt-2 border-t border-gray-200 text-[11px] text-gray-600">
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-gray-900 border border-white shadow" />
          <span>Workforce anchors (pipeline)</span>
        </div>
      </div>

      <div className="mt-2 text-[11px] text-gray-500">
        Hover for labels • Click for details
      </div>
    </div>
  );
}

export default function MapComponent() {
  // Commute context (visual guidance, not official data)
  const commuteRadiusMeters = 30000; // ~30km
  const commuteLines: [number, number][][] = [
    [center, [46.813, -92.104]], // example toward Duluth
    [center, [45.000, -93.265]], // example toward Twin Cities
  ];

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

        {/* Commute context overlay */}
        <Circle
          center={center}
          radius={commuteRadiusMeters}
          pathOptions={{ color: "#334155", weight: 1, fillColor: "#94a3b8", fillOpacity: 0.08 }}
        />
        {commuteLines.map((line, i) => (
          <Polyline
            key={i}
            positions={line}
            pathOptions={{ color: "#334155", weight: 2, opacity: 0.6, dashArray: "6 8" }}
          />
        ))}

        {/* Activity points (clustered) */}
        <MarkerClusterGroup chunkedLoading showCoverageOnHover={false} spiderfyOnMaxZoom>
          {activityLocations.map((loc, i) => (
            <Marker
              key={`act-${i}`}
              position={loc.position}
              icon={iconFor(loc.category, "activity")}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1} sticky>
                <div className="text-xs font-medium">{loc.name}</div>
                <div className="text-[11px] text-gray-600">{loc.category}</div>
              </Tooltip>

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

        {/* Workforce anchors (not clustered, intentional) */}
        {anchors.map((loc, i) => (
          <Marker
            key={`anc-${i}`}
            position={loc.position}
            icon={iconFor(loc.category, "anchor")}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={1} sticky>
              <div className="text-xs font-semibold">{loc.name}</div>
              <div className="text-[11px] text-gray-600">Workforce anchor</div>
            </Tooltip>
            <Popup>
              <div className="space-y-1">
                <div className="font-semibold">{loc.name}</div>
                <div className="text-sm text-gray-700">{loc.category}</div>
                {loc.note && <div className="text-sm text-gray-600">{loc.note}</div>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <Legend />
    </div>
  );
}
