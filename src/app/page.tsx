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

// Register Chart.js components (safe to run in client component)
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Dynamically load map (client-side only)
const MapComponent = dynamic(() => import("./components/MapComponent"), {
  ssr: false,
  loading: () => (
    <p className="text-center py-10 text-gray-500">Loading map...</p>
  ),
});

type Sector = {
  name: string;
  income: number; // $M
  share: number; // %
};

const SECTORS: Sector[] = [
  { name: "Health Care & Social Assistance", income: 400, share: 19.9 },
  { name: "Retail Trade", income: 191, share: 15.3 },
  { name: "Construction", income: 181, share: 7.6 },
  { name: "Manufacturing", income: 172, share: 9.5 },
  { name: "Accommodation & Food Services", income: 111, share: 13.8 },
  { name: "Educational Services", income: 110, share: 7.5 },
  { name: "Finance & Insurance", income: 106, share: 4.2 },
  {
    name: "Professional, Scientific, & Technical Services (incl. tech/IT)",
    income: 62,
    share: 2.6,
  },
  { name: "Wholesale Trade", income: 51, share: 2.5 },
  { name: "Information (incl. tech/telecom)", income: 29, share: 1.3 },
];

// Keep colors centralized so bar + pie match
const COLORS = [
  "#1f77b4",
  "#ff7f0e",
  "#2ca02c",
  "#d62728",
  "#9467bd",
  "#8c564b",
  "#e377c2",
  "#7f7f7f",
  "#bcbd22",
  "#17becf",
];

const barOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
    title: { display: false },
  },
  scales: {
    x: {
      ticks: {
        maxRotation: 60,
        minRotation: 40,
        autoSkip: true,
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => `$${value}M`,
      },
    },
  },
};

const pieOptions: ChartOptions<"pie"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: { boxWidth: 12 },
    },
    tooltip: { enabled: true },
  },
};

export default function Page() {
  const labels = SECTORS.map((s) => s.name);

  const barData = {
    labels,
    datasets: [
      {
        label: "Est. Labor Income ($ Millions)",
        data: SECTORS.map((s) => s.income),
        backgroundColor: COLORS,
        borderRadius: 8,
      },
    ],
  };

  const pieData = {
    labels,
    datasets: [
      {
        label: "Employment Share (%)",
        data: SECTORS.map((s) => s.share),
        backgroundColor: COLORS,
        borderWidth: 0,
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
            Crow Wing County • 2025 Estimates • Pathways to More Technology Jobs
          </p>
        </header>

        {/* Charts */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">
            Top 10 Income-Driving Sectors
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h3 className="text-xl font-medium mb-4 text-center">
                Labor Income ($M)
              </h3>
              <div className="h-96">
                <Bar data={barData} options={barOptions} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h3 className="text-xl font-medium mb-4 text-center">
                Employment Share (%)
              </h3>
              <div className="h-96">
                <Pie data={pieData} options={pieOptions} />
              </div>
            </div>
          </div>
        </section>

        {/* Map */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
            Tech Activity in the Brainerd Lakes Area
          </h2>

          <div className="h-[480px] bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <MapComponent />
          </div>

          <p className="text-sm text-gray-500 mt-3 text-center">
            Map loads client-side to avoid SSR issues with Leaflet.
          </p>
        </section>

        {/* Recommendations */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">
            Ways to Grow Tech Jobs
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-medium mb-4">
                Short-term (0–18 months)
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Start a local tech meetup or online group</li>
                <li>Promote remote work + lakes lifestyle</li>
                <li>Run IT workshops with Central Lakes College</li>
                <li>Share this dashboard with community leaders</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-medium mb-4">Medium & long term</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Develop co-working spaces with fast internet</li>
                <li>Apply for MN DEED rural tech grants</li>
                <li>Attract small software firms with incentives</li>
                <li>Build ties with existing tech employers</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-12 bg-indigo-50 rounded-2xl">
          <h2 className="text-3xl font-semibold mb-6 text-indigo-900">
            How You Can Help
          </h2>

          <div className="flex flex-wrap justify-center gap-4">
            {["Start a meetup", "Share this site", "Learn coding", "Contact BLAEDC"].map(
              (label) => (
                <span
                  key={label}
                  className="px-6 py-3 bg-white text-indigo-700 rounded-lg shadow-sm border border-indigo-200 font-medium"
                >
                  {label}
                </span>
              )
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
