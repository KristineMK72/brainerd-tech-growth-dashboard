"use client";

import dynamic from "next/dynamic";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  type ChartOptions,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// Map (client-only because Leaflet uses window/document)
const MapComponent = dynamic(() => import("./components/MapComponent"), {
  ssr: false,
  loading: () => <p className="text-center py-10 text-gray-500">Loading map...</p>,
});

/** ---- YOUR EXISTING SECTOR DATA (keep for now; later we can swap to real sources) ---- */
type Sector = { name: string; income: number; share: number };

const SECTORS: Sector[] = [
  { name: "Health Care & Social Assistance", income: 400, share: 19.9 },
  { name: "Retail Trade", income: 191, share: 15.3 },
  { name: "Construction", income: 181, share: 7.6 },
  { name: "Manufacturing", income: 172, share: 9.5 },
  { name: "Accommodation & Food Services", income: 111, share: 13.8 },
  { name: "Educational Services", income: 110, share: 7.5 },
  { name: "Finance & Insurance", income: 106, share: 4.2 },
  { name: "Professional, Scientific, & Technical Services (incl. tech/IT)", income: 62, share: 2.6 },
  { name: "Wholesale Trade", income: 51, share: 2.5 },
  { name: "Information (incl. tech/telecom)", income: 29, share: 1.3 },
];

const COLORS = ["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf"];

/** ---- NEW: Wage comparison chart data (wire now; swap to real values when verified) ----
 * Tip: You can keep this chart even before final numbers—just label it clearly in the Methodology section.
 */
type WageRow = {
  group: string;
  medianAnnualWage: number; // dollars
  bucket: "tech" | "non-tech";
};

// IMPORTANT: these are placeholders until you paste verified source numbers for the exact geography you want.
// Keep them realistic if you want; we’ll add citations + the correct area name in the footer.
const WAGES: WageRow[] = [
  { group: "Computer & Mathematical", medianAnnualWage: 82680, bucket: "tech" },
  { group: "Architecture & Engineering", medianAnnualWage: 80610, bucket: "tech" },
  { group: "Business & Financial Ops", medianAnnualWage: 73880, bucket: "non-tech" },
  { group: "Construction & Extraction", medianAnnualWage: 67560, bucket: "non-tech" },
  { group: "Health Practitioners (Clinical)", medianAnnualWage: 94710, bucket: "non-tech" },
  { group: "Education (Instruction & Library)", medianAnnualWage: 58820, bucket: "non-tech" },
  { group: "Sales & Related", medianAnnualWage: 36700, bucket: "non-tech" },
  { group: "Food Prep & Serving", medianAnnualWage: 30840, bucket: "non-tech" },
];

const barOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => {
          const v = Number(ctx.raw ?? 0);
          return ` $${v.toLocaleString()}/yr (median)`;
        },
      },
    },
  },
  scales: {
    x: {
      ticks: { maxRotation: 45, minRotation: 20, autoSkip: true },
    },
    y: {
      beginAtZero: true,
      ticks: {
        callback: (val) => `$${Number(val).toLocaleString()}`,
      },
    },
  },
};

const pieOptions: ChartOptions<"pie"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "bottom" },
  },
};

// Light utility for the callout
function formatList(names: string[]) {
  if (names.length <= 1) return names.join("");
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

export default function Home() {
  // Top 3 sectors by income (for the callout)
  const top3 = [...SECTORS].sort((a, b) => b.income - a.income).slice(0, 3).map((s) => s.name);

  const techShare =
    (SECTORS.find((s) => s.name.startsWith("Professional"))?.share ?? 0) +
    (SECTORS.find((s) => s.name.startsWith("Information"))?.share ?? 0);

  const sectorLabels = SECTORS.map((s) => s.name);

  const sectorBarData = {
    labels: sectorLabels,
    datasets: [
      {
        label: "Est. Labor Income ($ Millions)",
        data: SECTORS.map((s) => s.income),
        backgroundColor: COLORS,
        borderRadius: 8,
      },
    ],
  };

  const sectorPieData = {
    labels: sectorLabels,
    datasets: [
      {
        label: "Employment Share (%)",
        data: SECTORS.map((s) => s.share),
        backgroundColor: COLORS,
        borderWidth: 0,
      },
    ],
  };

  const wageData = {
    labels: WAGES.map((w) => w.group),
    datasets: [
      {
        label: "Median annual wage",
        data: WAGES.map((w) => w.medianAnnualWage),
        backgroundColor: WAGES.map((w) => (w.bucket === "tech" ? "#2563eb" : "#64748b")),
        borderRadius: 10,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-4">
            Brainerd Lakes Tech Growth Dashboard
          </h1>
          <p className="text-lg md:text-xl text-gray-700">
            Crow Wing County • Snapshot + Action Ideas • Tech as a wage and resilience lever
          </p>
        </header>

        {/* --- SECTION: Sectors charts --- */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
            Top 10 Income-Driving Sectors
          </h2>

          {/* Why this matters callout */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 mb-8">
            <h3 className="text-lg font-semibold text-indigo-900 mb-1">Why this matters</h3>
            <p className="text-gray-700 leading-relaxed">
              Brainerd’s biggest income-driving sectors include{" "}
              <span className="font-medium">{formatList(top3)}</span>. Expanding tech jobs—especially
              IT roles inside non-tech employers—can diversify the local economy, support higher wages,
              and strengthen year-round stability alongside tourism.
            </p>

            <div className="mt-3 inline-flex flex-wrap items-center gap-2 rounded-lg bg-white border border-indigo-100 px-3 py-2">
              <span className="text-sm text-gray-600">Tech-related share:</span>
              <span className="text-sm font-semibold text-indigo-700">{techShare.toFixed(1)}%</span>
              <span className="text-xs text-gray-500">(Information + Professional/Technical)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h3 className="text-xl font-medium mb-4 text-center">Labor Income ($M)</h3>
              <div className="h-96">
                <Bar data={sectorBarData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">
                These sector numbers are currently a snapshot estimate (we can replace with sourced tables).
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h3 className="text-xl font-medium mb-4 text-center">Employment Share (%)</h3>
              <div className="h-96">
                <Pie data={sectorPieData} options={pieOptions} />
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">
                Next upgrade: annotate the tech slice and show a “tech + adjacent” combined label.
              </p>
            </div>
          </div>
        </section>

        {/* --- SECTION: Wage comparison --- */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
            Pay comparison: tech vs other major job groups
          </h2>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 mb-4">
              <div>
                <h3 className="text-xl font-medium">Median annual wage by occupational group</h3>
                <p className="text-sm text-gray-600">
                  This is the easiest “impact chart” to understand: wages show why tech pathways matter.
                </p>
              </div>
              <div className="text-xs text-gray-500">
                Tech bars are highlighted; non-tech shown in gray.
              </div>
            </div>

            <div className="h-[420px]">
              <Bar data={wageData} options={barOptions} />
            </div>

            <p className="text-xs text-gray-500 mt-3">
              Next: add a toggle for Median vs Mean and allow switching the geography (county / region / micropolitan).
            </p>
          </div>
        </section>

        {/* --- SECTION: Map --- */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
            Tech Activity in the Brainerd Lakes Area
          </h2>

          <div className="h-[480px] bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <MapComponent />
          </div>

          <p className="text-sm text-gray-500 mt-3 text-center">
            Hover for quick labels • Click for details • Clusters group points at lower zooms.
          </p>
        </section>

        {/* --- SECTION: Commuting & leakage scaffolding --- */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-4 text-center text-gray-800">
            Commuting & “leakage” (work happening elsewhere)
          </h2>

          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 mb-8">
            <h3 className="text-lg font-semibold text-indigo-900 mb-1">What is leakage?</h3>
            <p className="text-gray-700 leading-relaxed">
              When residents commute out for higher-wage jobs (or remote-work for out-of-area employers),
              part of that income can still benefit the local economy—but spending patterns, taxes, and time costs
              may shift. Measuring commuting helps leaders target: local employer attraction, coworking, training,
              and infrastructure.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-medium mb-3">Chart placeholder (next)</h3>
              <p className="text-gray-700">
                Next concrete chart: <span className="font-medium">Tech commuters vs local tech workers</span>{" "}
                (share of residents working outside the county / region).
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Data sources we can use: ACS commuting (county-to-county) or LEHD/OnTheMap flows.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-medium mb-3">Costs to residents</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>time cost (hours commuting)</li>
                <li>vehicle cost (miles, fuel, depreciation)</li>
                <li>childcare scheduling and “time poverty”</li>
                <li>less weekday spending near home</li>
              </ul>
              <p className="text-sm text-gray-500 mt-2">
                Once you choose the comparison cities + commute destinations, we can quantify this.
              </p>
            </div>
          </div>
        </section>

        {/* --- SECTION: Action ideas --- */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">
            Ways to Grow Tech Jobs
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-medium mb-4">Short-term (0–18 months)</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Start a local tech meetup or online group</li>
                <li>Promote remote work + lakes lifestyle</li>
                <li>Run IT workshops with Central Lakes College</li>
                <li>Share this dashboard with community leaders</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-medium mb-4">Medium &amp; long term</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Develop coworking spaces with fast internet</li>
                <li>Apply for MN DEED rural tech grants</li>
                <li>Attract small software firms with incentives</li>
                <li>Build ties with existing tech employers</li>
              </ul>
            </div>
          </div>
        </section>

        {/* --- CTA --- */}
        <section className="text-center py-12 bg-indigo-50 rounded-2xl">
          <h2 className="text-3xl font-semibold mb-6 text-indigo-900">How You Can Help</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {["Start a meetup", "Share this site", "Learn coding", "Contact BLAEDC"].map((label) => (
              <span
                key={label}
                className="px-6 py-3 bg-white text-indigo-700 rounded-lg shadow-sm border border-indigo-200 font-medium"
              >
                {label}
              </span>
            ))}
          </div>
        </section>

        {/* --- Sources / Methodology footer --- */}
        <footer className="mt-14 text-center text-xs text-gray-500">
          <div className="max-w-3xl mx-auto">
            <p className="font-semibold text-gray-600">Sources & Methodology (draft)</p>
            <p className="mt-2">
              Map basemap: OpenStreetMap. Sector and wage charts: placeholders wired for sourced tables.
              Next upgrade: replace wage values with verified OEWS/ACS tables for the chosen geography
              (county, sub-state region, or micropolitan definition).
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
