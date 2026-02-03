"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
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
import { DATASETS, type GeographyKey, type WageMode } from "./data/datasets";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const MapComponent = dynamic(() => import("./components/MapComponent"), {
  ssr: false,
  loading: () => <p className="text-center py-10 text-gray-500">Loading map...</p>,
});

// ---- Your existing sector data stays here for now ----
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
  { name: "Information (incl. tech/telecom)", income: 29, share: 1.3 },
];

const COLORS = ["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf"];

const barOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => {
          const v = Number(ctx.raw ?? 0);
          return ` $${v.toLocaleString()}/yr`;
        },
      },
    },
  },
  scales: {
    x: { ticks: { maxRotation: 45, minRotation: 15, autoSkip: true } },
    y: { beginAtZero: true, ticks: { callback: (v) => `$${Number(v).toLocaleString()}` } },
  },
};

const pieOptions: ChartOptions<"pie"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: "bottom" } },
};

function money(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default function Home() {
  // ---- NEW UI state ----
  const [geoKey, setGeoKey] = useState<GeographyKey>("crow_wing_county");
  const [wageMode, setWageMode] = useState<WageMode>("median");

  const dataset = useMemo(() => DATASETS.find((d) => d.key === geoKey)!, [geoKey]);

  // ---- existing sector callout helpers ----
  const top3 = [...SECTORS].sort((a, b) => b.income - a.income).slice(0, 3).map((s) => s.name);
  const techShare =
    (SECTORS.find((s) => s.name.startsWith("Professional"))?.share ?? 0) +
    (SECTORS.find((s) => s.name.startsWith("Information"))?.share ?? 0);

  // ---- sector charts ----
  const sectorBarData = useMemo(() => ({
    labels: SECTORS.map((s) => s.name),
    datasets: [{ label: "Est. Labor Income ($M)", data: SECTORS.map((s) => s.income), backgroundColor: COLORS, borderRadius: 8 }],
  }), []);
  const sectorPieData = useMemo(() => ({
    labels: SECTORS.map((s) => s.name),
    datasets: [{ label: "Employment Share (%)", data: SECTORS.map((s) => s.share), backgroundColor: COLORS, borderWidth: 0 }],
  }), []);

  // ---- wage chart (median vs mean toggle) ----
  const wageChart = useMemo(() => {
    const labels = dataset.wageRows.map((r) => r.group);
    const values = dataset.wageRows.map((r) => (wageMode === "median" ? r.median : r.mean));
    const colors = dataset.wageRows.map((r) => (r.tech ? "#2563eb" : "#64748b"));
    return {
      labels,
      data: {
        labels,
        datasets: [{ label: wageMode === "median" ? "Median annual wage" : "Mean annual wage", data: values, backgroundColor: colors, borderRadius: 10 }],
      },
    };
  }, [dataset, wageMode]);

  // ---- commuting chart ----
  const commuteData = useMemo(() => {
    const c = dataset.commute;
    return {
      labels: ["Local tech workers", "Tech commuters out", "Remote out-of-area (est.)"],
      datasets: [{
        label: "People",
        data: [c.localTechWorkers, c.techCommutersOut, c.remoteOutOfArea],
        backgroundColor: ["#16a34a", "#f97316", "#2563eb"],
        borderRadius: 10,
      }],
    };
  }, [dataset]);

  const commuteBarOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { callback: (v) => Number(v).toLocaleString() } } },
  };

  // ---- cost calculator assumptions (editable later) ----
  const commuters = dataset.commute.techCommutersOut;
  const rtMiles = dataset.commute.avgRoundTripMiles;
  const rtMinutes = dataset.commute.avgRoundTripMinutes;

  // IRS 2026 business standard mileage rate is 72.5 cents per mile. :contentReference[oaicite:0]{index=0}
  const mileageRate = 0.725;

  const tripsPerYear = 230; // typical workdays
  const annualMiles = commuters * rtMiles * tripsPerYear;
  const annualMileageCost = annualMiles * mileageRate;

  // time value: you can swap this to local median hourly wage later
  const valueOfTimePerHour = 25;
  const annualHours = commuters * (rtMinutes / 60) * tripsPerYear;
  const annualTimeCost = annualHours * valueOfTimePerHour;

  // optional childcare/time poverty placeholder
  const childcarePerDay = 0; // set to e.g. 12 if you want a conservative daily add-on
  const annualChildcareCost = commuters * tripsPerYear * childcarePerDay;

  const annualTotalCost = annualMileageCost + annualTimeCost + annualChildcareCost;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-3">Brainerd Lakes Tech Growth Dashboard</h1>
          <p className="text-lg md:text-xl text-gray-700">Crow Wing County • Tech pathways • Wages, commuting, and local opportunity</p>
        </header>

        {/* ---- Controls bar ---- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-10">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
            <div>
              <div className="text-sm text-gray-500">Geography</div>
              <select
                className="mt-1 rounded-lg border border-gray-200 px-3 py-2 text-gray-800"
                value={geoKey}
                onChange={(e) => setGeoKey(e.target.value as GeographyKey)}
              >
                {DATASETS.map((d) => (
                  <option key={d.key} value={d.key}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="text-sm text-gray-500">Wage mode</div>
              <div className="mt-1 inline-flex rounded-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setWageMode("median")}
                  className={`px-3 py-2 text-sm ${wageMode === "median" ? "bg-indigo-600 text-white" : "bg-white text-gray-700"}`}
                >
                  Median
                </button>
                <button
                  onClick={() => setWageMode("mean")}
                  className={`px-3 py-2 text-sm ${wageMode === "mean" ? "bg-indigo-600 text-white" : "bg-white text-gray-700"}`}
                >
                  Mean
                </button>
              </div>
              <div className="text-xs text-gray-500 mt-1">Median = typical worker; Mean = pulled up by high earners</div>
            </div>

            <div className="text-xs text-gray-500 md:text-right">
              <div className="font-semibold text-gray-600">Dataset notes</div>
              {dataset.notes.map((n) => (
                <div key={n}>{n}</div>
              ))}
            </div>
          </div>
        </div>

        {/* ---- Sector charts ---- */}
        <section className="mb-14">
          <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Top 10 Income-Driving Sectors</h2>

          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 mb-8">
            <h3 className="text-lg font-semibold text-indigo-900 mb-1">Why this matters</h3>
            <p className="text-gray-700 leading-relaxed">
              Brainerd’s biggest income-driving sectors include{" "}
              <span className="font-medium">{top3.join(", ")}</span>. Expanding tech jobs—especially IT roles inside non-tech employers—can diversify
              the local economy, support higher wages, and strengthen year-round stability alongside tourism.
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
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h3 className="text-xl font-medium mb-4 text-center">Employment Share (%)</h3>
              <div className="h-96">
                <Pie data={sectorPieData} options={pieOptions} />
              </div>
            </div>
          </div>
        </section>

        {/* ---- Wage comparison (toggle-driven) ---- */}
        <section className="mb-14">
          <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
            Pay comparison by occupational group ({wageMode === "median" ? "median" : "mean"})
          </h2>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 mb-4">
              <div>
                <h3 className="text-xl font-medium">Wages (tech highlighted)</h3>
                <p className="text-sm text-gray-600">Use this to show why tech pathways raise earning potential.</p>
              </div>
              <div className="text-xs text-gray-500">
                Blue = tech-related groups • Gray = other groups
              </div>
            </div>

            <div className="h-[420px]">
              <Bar data={wageChart.data} options={barOptions} />
            </div>
          </div>
        </section>

        {/* ---- Map ---- */}
        <section className="mb-14">
          <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Tech Activity in the Brainerd Lakes Area</h2>
          <div className="h-[480px] bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <MapComponent />
          </div>
        </section>

        {/* ---- Commuting & leakage ---- */}
        <section className="mb-14">
          <h2 className="text-3xl font-semibold mb-4 text-center text-gray-800">Commuting & “leakage”</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h3 className="text-xl font-medium mb-2">Tech commuters vs local tech workers</h3>
              <p className="text-sm text-gray-600 mb-4">
                This becomes real once we plug in counts from ACS commuting flows or LEHD/OnTheMap.
              </p>

              <div className="h-[320px]">
                <Bar data={commuteData} options={commuteBarOptions} />
              </div>

              <div className="text-xs text-gray-500 mt-3">
                Data options: ACS County-to-County Commuting Flows (5-year) or LEHD LODES/OnTheMap (more current).
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-indigo-900 mb-2">Estimated annual cost to residents</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Based on your selected geography’s commuter assumptions: {commuters.toLocaleString()} tech commuters out, ~{rtMiles} round-trip miles,
                ~{rtMinutes} round-trip minutes, {tripsPerYear} workdays/year.
              </p>

              <div className="mt-4 grid grid-cols-1 gap-3">
                <div className="bg-white rounded-xl border border-indigo-100 p-4">
                  <div className="text-xs text-gray-500">Mileage cost (IRS 2026 rate)</div>
                  <div className="text-lg font-semibold text-indigo-800">{money(annualMileageCost)}</div>
                  <div className="text-xs text-gray-500">72.5¢/mile for business use in 2026. :contentReference[oaicite:1]{index=1}</div>
                </div>

                <div className="bg-white rounded-xl border border-indigo-100 p-4">
                  <div className="text-xs text-gray-500">Time cost (value of time)</div>
                  <div className="text-lg font-semibold text-indigo-800">{money(annualTimeCost)}</div>
                  <div className="text-xs text-gray-500">Assumes ${valueOfTimePerHour}/hour as a conservative time value.</div>
                </div>

                <div className="bg-white rounded-xl border border-indigo-100 p-4">
                  <div className="text-xs text-gray-500">Childcare / scheduling add-on</div>
                  <div className="text-lg font-semibold text-indigo-800">{money(annualChildcareCost)}</div>
                  <div className="text-xs text-gray-500">Currently set to ${childcarePerDay}/day (edit in code to model “time poverty”).</div>
                </div>

                <div className="bg-white rounded-xl border border-indigo-100 p-4">
                  <div className="text-xs text-gray-500">Total estimated annual burden</div>
                  <div className="text-2xl font-bold text-indigo-900">{money(annualTotalCost)}</div>
                  <div className="text-xs text-gray-500">
                    This is a modeling tool — once we plug in real commute counts, it becomes a strong policy chart.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---- Methodology / sources ---- */}
        <footer className="mt-14 text-center text-xs text-gray-500">
          <div className="max-w-3xl mx-auto">
            <p className="font-semibold text-gray-600">Sources & Methodology</p>
            <p className="mt-2">
              Base map: OpenStreetMap. Commuting flows can be sourced from Census “County-to-County Commuting Flows” tables (released every five years using ACS 5-year data). :contentReference[oaicite:2]{index=2}
              Workforce commuting can also be sourced from LEHD LODES via OnTheMap (work/home flow data). :contentReference[oaicite:3]{index=3}
            </p>
            <p className="mt-2">
              OEWS occupational wage estimates are published by BLS for metro and nonmetro area definitions. :contentReference[oaicite:4]{index=4}
            </p>
            <p className="mt-2">
              Note: Numbers shown here may include placeholders until you confirm the geography + table extracts you want to cite.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
