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

  // Base data - 2024/2025 estimates for Crow Wing County / Brainerd Lakes Area
  const baseTechJobs = 822 + 395; // Professional/Scientific + Information sector
  const sectors = [
    { name: 'Health Care & Social Assistance', income: 400, share: 19.9 },
    { name: 'Retail Trade', income: 191, share: 15.3 },
    { name: 'Construction', income: 181, share: 7.6 },
    { name: 'Manufacturing', income: 172, share: 9.5 },
    { name: 'Accommodation & Food Services', income: 111, share: 13.8 },
    { name: 'Educational Services', income: 110, share: 7.5 },
    { name: 'Finance & Insurance', income: 106, share: 4.2 },
    {
      name: 'Professional, Scientific, & Technical Services (incl. tech/IT)',
      income: 62 * growthFactor,
      share: 2.6,
    },
    { name: 'Wholesale Trade', income: 51, share: 2.5 },
    { name: 'Information (incl. tech/telecom)', income: 29 * growthFactor, share: 1.3 },
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
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-4">
            Brainerd Lakes Tech Growth Dashboard
          </h1>
          <p className="text-lg md:text-xl text-gray-700">
            Crow Wing County • 2025 Estimates • Pathways to Grow Technology Jobs
          </p>
        </header>

        {/* Charts Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">
            Top 10 Income-Driving Sectors
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Bar Chart */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h3 className="text-xl font-medium mb-4 text-center">
                Labor Income ($ Millions)
              </h3>
              <div className="h-96">
                <Bar
                  data={barData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                  }}
                />
              </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h3 className="text-xl font-medium mb-4 text-center">
                Employment Share (%)
              </h3>
              <div className="h-96">
                <Pie
                  data={pieData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'right' as const } },
                  }}
                />
              </div>
            </div>
          </div>

          {/* Growth Slider */}
          <div className="mt-10 max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md border border-gray-100">
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
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="mt-4 text-center text-lg">
              Growth factor: <strong>{growthFactor.toFixed(1)}×</strong>
              <br />
              Projected tech-related jobs: ≈
              <strong className="text-indigo-700">
                {Math.round(baseTechJobs * growthFactor)}
              </strong>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
            Current Tech Activity in the Brainerd Lakes Area
          </h2>
          <div className="h-[480px] bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <MapComponent />
          </div>
          <p className="mt-4 text-center text-gray-600 text-sm">
            Interactive map centered on Brainerd • Markers indicate approximate locations of existing tech-related employers and activity
          </p>
        </section>

        {/* Solutions Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-gray-800 text-center">
            Realistic Ways to Grow the Tech Sector
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-medium mb-4">Short-term actions (0–18 months)</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Start a Brainerd Lakes tech meetup or online group</li>
                <li>Promote remote work + lakes lifestyle to attract talent</li>
                <li>Partner with Central Lakes College for IT bootcamps / workshops</li>
                <li>Share this dashboard with local leaders & groups</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-medium mb-4">Medium & longer-term strategies</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Develop co-working spaces with high-speed fiber</li>
                <li>Apply for MN DEED rural tech / broadband grants</li>
                <li>Offer incentives to attract small software & data companies</li>
                <li>Build relationships with regional tech anchors (e.g. Ascensus)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-12 bg-indigo-50 rounded-2xl">
          <h2 className="text-3xl font-semibold mb-6 text-indigo-900">
            How You Can Help Move This Forward
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8">
            Even small steps from local people can create momentum.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="px-6 py-3 bg-white text-indigo-700 rounded-lg font-medium shadow-sm border border-indigo-200">
              Start a meetup
            </span>
            <span className="px-6 py-3 bg-white text-indigo-700 rounded-lg font-medium shadow-sm border border-indigo-200">
              Share this site
            </span>
            <span className="px-6 py-3 bg-white text-indigo-700 rounded-lg font-medium shadow-sm border border-indigo-200">
              Learn to code
            </span>
            <span className="px-6 py-3 bg-white text-indigo-700 rounded-lg font-medium shadow-sm border border-indigo-200">
              Talk to BLAEDC
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
