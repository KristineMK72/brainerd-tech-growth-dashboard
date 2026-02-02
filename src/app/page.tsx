'use client';

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
  const sectors = [
    { name: 'Health Care & Social Assistance', income: 400, share: 19.9 },
    { name: 'Retail Trade',                   income: 191, share: 15.3 },
    { name: 'Construction',                   income: 181, share: 7.6  },
    { name: 'Manufacturing',                  income: 172, share: 9.5  },
    { name: 'Accommodation & Food Services',  income: 111, share: 13.8 },
    { name: 'Educational Services',           income: 110, share: 7.5  },
    { name: 'Finance & Insurance',            income: 106, share: 4.2  },
    { name: 'Professional, Scientific, & Technical (tech/IT)', income: 62,  share: 2.6 },
    { name: 'Wholesale Trade',                income: 51,  share: 2.5  },
    { name: 'Information (tech/telecom)',     income: 29,  share: 1.3  },
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
      backgroundColor: [
        '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
        '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
      ],
    }],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-800 mb-3">
            Brainerd Lakes Tech Growth Dashboard
          </h1>
          <p className="text-lg md:text-xl text-gray-700">
            2025 Economic Overview • Crow Wing County • Pathways to More Technology Jobs
          </p>
        </header>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
            Top Income-Driving Sectors
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h3 className="text-xl font-medium mb-4 text-center">Labor Income ($M)</h3>
              <div style={{ height: '380px' }}>
                <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h3 className="text-xl font-medium mb-4 text-center">Employment Share (%)</h3>
              <div style={{ height: '380px' }}>
                <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
            Where Tech Activity Exists Today
          </h2>
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100" style={{ height: '480px' }}>
            <MapComponent />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">Realistic Ways to Grow Tech Jobs</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-medium mb-3">Short-term (1–2 years)</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Partner with Central Lakes College for IT / coding bootcamps</li>
                <li>Launch a Brainerd-area tech meetup or Discord group</li>
                <li>Market remote-work lifestyle to tech workers (lakes + low cost of living)</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-medium mb-3">Medium-term (3–5 years)</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Build co-working / maker spaces with fiber internet</li>
                <li>Apply for MN DEED or federal rural tech grants</li>
                <li>Attract small software firms with tax incentives + quality-of-life pitch</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="text-center py-8">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">How You Can Contribute</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-6">
            You’re in a great position to help move this forward — even small actions add up.
          </p>
          <div className="inline-flex flex-wrap justify-center gap-4">
            <span className="px-5 py-3 bg-indigo-100 text-indigo-800 rounded-lg font-medium">Start a meetup</span>
            <span className="px-5 py-3 bg-indigo-100 text-indigo-800 rounded-lg font-medium">Share this dashboard</span>
            <span className="px-5 py-3 bg-indigo-100 text-indigo-800 rounded-lg font-medium">Learn to code</span>
            <span className="px-5 py-3 bg-indigo-100 text-indigo-800 rounded-lg font-medium">Talk to BLAEDC</span>
          </div>
        </section>
      </div>
    </div>
  );
}
