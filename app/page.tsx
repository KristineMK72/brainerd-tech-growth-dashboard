'use client';

import { useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const MapComponent = dynamic(() => import('../components/MapComponent'), { ssr: false });

export default function Home() {
  const [growthFactor, setGrowthFactor] = useState(1.0);

  const baseTechJobs = 822 + 395; // Professional + Information

  const sectors = [
    { name: 'Health Care & Social Assistance', income: 400, share: 19.9 },
    { name: 'Retail Trade', income: 191, share: 15.3 },
    { name: 'Construction', income: 181, share: 7.6 },
    { name: 'Manufacturing', income: 172, share: 9.5 },
    { name: 'Accommodation & Food Services', income: 111, share: 13.8 },
    { name: 'Educational Services', income: 110, share: 7.5 },
    { name: 'Finance & Insurance', income: 106, share: 4.2 },
    {
      name: 'Professional, Scientific, & Technical (incl. tech/IT)',
      income: Math.round(62 * growthFactor),
      share: 2.6,
    },
    { name: 'Wholesale Trade', income: 51, share: 2.5 },
    {
      name: 'Information (incl. tech/telecom)',
      income: Math.round(29 * growthFactor),
      share: 1.3,
    },
  ];

  const barData = {
    labels: sectors.map(s => s.name),
    datasets: [{
      label: 'Estimated Labor Income ($ Millions)',
      data: sectors.map(s => s.income),
      backgroundColor: [
        '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
        '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
      ],
    }],
  };

  const pieData = {
    labels: sectors.map(s => s.name),
    datasets: [{
      data: sectors.map(s => s.share),
      backgroundColor: barData.datasets[0].backgroundColor,
    }],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-4">
            Brainerd Lakes Tech Growth Dashboard
          </h1>
          <p className="text-lg md:text-xl text-gray-700">
            Crow Wing County • 2025 • Pathways to More Technology Jobs
          </p>
        </header>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">
            Top Income-Driving Sectors
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h3 className="text-xl font-medium mb-4 text-center">Labor Income ($M)</h3>
              <div className="h-96">
                <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h3 className="text-xl font-medium mb-4 text-center">Employment Share (%)</h3>
              <div className="h-96">
                <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
          </div>

          {/* Native HTML range slider */}
          <div className="mt-12 max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h3 className="text-xl font-medium mb-4 text-center">
              Simulate Tech Sector Growth
            </h3>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={growthFactor}
              onChange={(e) => setGrowthFactor(parseFloat(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="mt-4 text-center text-lg">
              Growth factor: <strong>{growthFactor.toFixed(1)}×</strong>
              <br />
              Projected tech jobs ≈ <strong className="text-indigo-700">
                {Math.round(baseTechJobs * growthFactor)}
              </strong>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
            Tech Activity in Brainerd Lakes
          </h2>
          <div className="h-[480px] bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <MapComponent />
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">
            Ways to Grow Tech Jobs
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-medium mb-4">Short-term (0–18 months)</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Start a Brainerd Lakes tech meetup or group</li>
                <li>Promote remote work + lakes lifestyle</li>
                <li>Run IT workshops with Central Lakes College</li>
                <li>Share this dashboard locally</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-medium mb-4">Medium & long term</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Develop co-working spaces with fast internet</li>
                <li>Apply for MN DEED & federal rural tech grants</li>
                <li>Attract small software firms with incentives</li>
                <li>Build ties with existing tech employers</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="text-center py-12 bg-indigo-50 rounded-2xl">
          <h2 className="text-3xl font-semibold mb-6 text-indigo-900">
            How You Can Help
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="px-6 py-3 bg-white text-indigo-700 rounded-lg shadow-sm border border-indigo-200 font-medium">
              Start a meetup
            </span>
            <span className="px-6 py-3 bg-white text-indigo-700 rounded-lg shadow-sm border border-indigo-200 font-medium">
              Share this site
            </span>
            <span className="px-6 py-3 bg-white text-indigo-700 rounded-lg shadow-sm border border-indigo-200 font-medium">
              Learn coding
            </span>
            <span className="px-6 py-3 bg-white text-indigo-700 rounded-lg shadow-sm border border-indigo-200 font-medium">
              Contact BLAEDC
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
