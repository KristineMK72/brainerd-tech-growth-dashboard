'use client';

import { useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import Slider from 'react-slider';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const MapComponent = dynamic(() => import('../components/MapComponent'), { ssr: false });

export default function Home() {
  const [techGrowthFactor, setTechGrowthFactor] = useState(1); // Slider for projections (1x = baseline)

  // Updated 2025 Data (from DEED/MN reports: Pop 68,642; Economy: 13th largest in MN, 10th fastest growth since 2019)
  const sectors = [
    { name: 'Health Care & Social Assistance', jobs: 6179, income: 400, share: 19.9, avgWage: 64687, medianWage: 58000 },
    { name: 'Retail Trade', jobs: 4738, income: 191, share: 15.3, avgWage: 40349, medianWage: 35000 },
    { name: 'Construction', jobs: 2355, income: 181, share: 7.6, avgWage: 76742, medianWage: 68000 },
    { name: 'Manufacturing', jobs: 2949, income: 172, share: 9.5, avgWage: 58366, medianWage: 52000 },
    { name: 'Accommodation & Food Services', jobs: 4277, income: 111, share: 13.8, avgWage: 25876, medianWage: 25000 },
    { name: 'Educational Services', jobs: 2319, income: 110, share: 7.5, avgWage: 47389, medianWage: 42000 },
    { name: 'Finance & Insurance', jobs: 1305, income: 106, share: 4.2, avgWage: 81000, medianWage: 72000 },
    { name: 'Professional, Scientific, & Technical Services', jobs: 822 * techGrowthFactor, income: 62 * techGrowthFactor, share: 2.6, avgWage: 75915, medianWage: 68000 },
    { name: 'Wholesale Trade', jobs: 778, income: 51, share: 2.5, avgWage: 65000, medianWage: 58000 },
    { name: 'Information', jobs: 395 * techGrowthFactor, income: 29 * techGrowthFactor, share: 1.3, avgWage: 74050, medianWage: 65000 },
  ];

  // Bar Chart Data
  const barData = {
    labels: sectors.map(s => s.name),
    datasets: [{ label: 'Est. Labor Income ($M)', data: sectors.map(s => s.income), backgroundColor: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'] }],
  };

  // Pie Chart Data (Employment Share)
  const pieData = {
    labels: sectors.map(s => s.name),
    datasets: [{ data: sectors.map(s => s.share), backgroundColor: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'] }],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-8 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-700">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-800 dark:text-blue-200">Brainerd Lakes Tech Growth Dashboard</h1>
        <p className="text-lg mt-2">Interactive analysis of economy (2025 updates) + solutions for more tech jobs. Population: 68,642 (up ~3% from 2024).</p>
        <button onClick={() => document.documentElement.classList.toggle('dark')} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Toggle Dark Mode</button>
      </header>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Economic Stats & Charts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-4 rounded shadow-md dark:bg-gray-800"><Bar data={barData} options={{ animation: { duration: 2000 } }} /></div>
          <div className="bg-white p-4 rounded shadow-md dark:bg-gray-800"><Pie data={pieData} options={{ animation: { duration: 2000 } }} /></div>
        </div>
        <div className="mt-8">
          <h3 className="text-xl">Project Tech Growth</h3>
          <Slider className="w-full" min={1} max={3} step={0.1} value={techGrowthFactor} onChange={setTechGrowthFactor} />
          <p>Factor: {techGrowthFactor}x (e.g., 2x = double tech jobs/income via investments). Updated tech jobs: ~{(822 + 395) * techGrowthFactor}</p>
        </div>
        <table className="mt-4 w-full border-collapse border border-gray-300 dark:border-gray-600">
          <thead><tr><th className="border p-2">Sector</th><th>Jobs</th><th>Income ($M)</th><th>Avg Wage</th><th>Median Wage</th></tr></thead>
          <tbody>{sectors.map(s => <tr key={s.name}><td className="border p-2">{s.name}</td><td>{Math.round(s.jobs)}</td><td>{Math.round(s.income)}</td><td>${s.avgWage}</td><td>${s.medianWage}</td></tr>)}</tbody>
        </table>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Spatial Analysis: Tech in Brainerd Lakes</h2>
        <div className="h-96 bg-white rounded shadow-md dark:bg-gray-800"><MapComponent /></div>
        <p className="mt-4">Map shows key tech spots (e.g., Ascensus, Growth Zone). Zoom/pan for details. Potential: Add remote hubs near lakes for work-life balance.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Solutions for More Tech Sectors</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Infrastructure & Training</strong>: Invest in broadband (like Fergus Falls) and partner with Central Lakes College for IT bootcamps. Projections: +5-10% tech jobs by 2028 with grants like TechHire ($150M available nationally).</li>
          <li><strong>Attract Startups/Talent</strong>: Offer incentives (tax breaks, co-working spaces) to draw remote workers/tech firms. Model after Bozeman: University ties + natural assets = 13% tech jobs share.</li>
          <li><strong>Resident Recruitment</strong>: Promote quality of life (lakes, affordability) via campaigns. MN Extension research: Focus on family-friendly, safe vibes to boost population/ workforce.</li>
          <li><strong>Partnerships</strong>: Collaborate with BLAEDC, MN Chamber for diversification. Embrace immigration for talent; rural tech grew 3rd fastest pre-2020.</li>
          <li><strong>Ecosystem Building</strong>: Launch accelerators for agritech/software (e.g., via CORI strategies). Potential: Double tech income to $180M with 2x growth.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">How You Can Contribute, Kristine</h2>
        <p>As a local in Brainerd, you're ideally positioned! Start small:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Join/organize meetups (e.g., via Meetup.com) for tech enthusiasts—focus on skills like coding (free via freeCodeCamp).</li>
          <li>Advocate: Contact BLAEDC or Crow Wing County reps to push for training programs. Share this dashboard at town halls.</li>
          <li>Skill Up & Network: Learn JS/React (as in this app) and connect with firms like Ascensus (480 jobs) or Growth Zone.</li>
          <li>Community Impact: Volunteer for resident recruitment—highlight Brainerd's median age (45.5) for mid-career tech shifts. Per capita income ($40,308) could rise with your input.</li>
          <li>Expand This Project: Add user-submitted ideas via forms; deploy updates on Vercel for real-time feedback.</li>
        </ul>
      </section>
    </div>
  );
}
