// src/pages/Dashboard.jsx
import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const ledger = useMemo(() => JSON.parse(localStorage.getItem('ecoCart') || '[]'), []);
  const totalPoints = useMemo(() => ledger.reduce((acc, item) => acc + (item.score - 50), 0), [ledger]);
  const totalCO2 = useMemo(() => ledger.reduce((acc, item) => acc + (item.material === 'plastic' ? 3.5 : 1.5), 0), [ledger]);

  // Mock data for yearly forecast
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Current CO2 Impact (kg)',
        data: [1.2, 1.1, 1.3, 1.2, 1.4, 1.3, 1.2, 1.1, 1.0, 0.9, 0.8, 0.7],
        borderColor: '#10b981', // emerald-500
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Sustainable Forecast',
        data: [1.2, 1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.05],
        borderColor: '#3b82f6', // blue-500
        borderDash: [5, 5],
        backgroundColor: 'transparent',
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: '#9ca3af' } },
      title: { display: false }
    },
    scales: {
      y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#9ca3af' } },
      x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#9ca3af' } }
    }
  };

  return (
    <div className="fade-in space-y-8">
      <div className="flex justify-between items-center bg-emerald-500/10 p-8 rounded-2xl border border-emerald-500/20 shadow-lg">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">My Eco Impact</h1>
          <p className="text-emerald-400">Sustainability Level: <span className="font-bold">Eco-Warrior</span></p>
        </div>
        <div className="text-center bg-white/5 p-4 py-3 rounded-xl border border-white/10 shadow-inner">
          <div className="text-3xl font-bold text-emerald-400">{totalPoints}</div>
          <div className="text-xs uppercase tracking-widest text-gray-400">Total Points</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 flex flex-col items-center">
          <div className="text-3xl mb-2">💨</div>
          <div className="text-2xl font-bold text-white">{totalCO2.toFixed(1)} kg</div>
          <div className="text-sm text-gray-500">CO2 Footprint</div>
        </div>
        <div className="glass-card p-6 flex flex-col items-center">
          <div className="text-3xl mb-2">🌳</div>
          <div className="text-2xl font-bold text-white">{Math.floor(totalCO2 / 20)}</div>
          <div className="text-sm text-gray-500">Trees Offset</div>
        </div>
        <div className="glass-card p-6 flex flex-col items-center">
          <div className="text-3xl mb-2">📦</div>
          <div className="text-2xl font-bold text-white">{ledger.length}</div>
          <div className="text-sm text-gray-500">Eco Purchases</div>
        </div>
        <div className="glass-card p-6 flex flex-col items-center">
          <div className="text-3xl mb-2">⚡</div>
          <div className="text-2xl font-bold text-white">82%</div>
          <div className="text-sm text-gray-500">Optimization Score</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-8">
          <h3 className="text-xl font-bold mb-6 text-white">Projected Reduction Pathway</h3>
          <Line data={data} options={options} />
        </div>
        
        <div className="glass-card p-8 flex flex-col">
          <h3 className="text-xl font-bold mb-6 text-white">Green Ledger Alerts</h3>
          <div className="space-y-4 flex-1 overflow-y-auto max-h-[400px]">
             {ledger.length === 0 ? (
               <div className="text-center text-gray-500 mt-10 italic">No purchase history yet.</div>
             ) : ledger.map((item, idx) => (
               <div key={idx} className={`p-4 rounded-xl border flex justify-between items-center ${
                 item.score < 40 ? 'bg-red-500/10 border-red-500/20' : 'bg-white/5 border-white/10'
               }`}>
                 <div>
                   <div className="text-sm font-bold text-white">{item.title}</div>
                   <div className="text-xs text-gray-400 capitalize">{item.material} • Impact: {item.score < 40 ? 'High' : 'Low'}</div>
                 </div>
                 <div className={`text-xs font-bold px-2 py-1 rounded bg-opacity-20 ${
                   item.score < 40 ? 'text-red-400 bg-red-400' : 'text-emerald-400 bg-emerald-400'
                 }`}>
                   {item.score < 40 ? 'ALERT' : 'PENDING'}
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
