// src/pages/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center fade-in">
      <h1 className="text-6xl font-extrabold text-white mb-6">
        Sustainability <span className="text-emerald-400">Simplified.</span>
      </h1>
      <p className="text-xl text-gray-400 max-w-2xl mb-12">
        EcoSphere is your personal sustainability assistant. Track your impact, discover eco-friendly alternatives, and optimize your lifestyle for a greener future.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mb-16">
        <div className="glass-card p-8 flex flex-col items-center">
          <div className="text-4xl mb-4">🛒</div>
          <h3 className="text-xl font-bold mb-2">Smart Marketplace</h3>
          <p className="text-gray-400">Get real-time sustainability insights for every product you view.</p>
        </div>
        <div className="glass-card p-8 flex flex-col items-center">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-xl font-bold mb-2">Impact Dashboard</h3>
          <p className="text-gray-400">Visualize your CO2 footprint and track your eco-points progress.</p>
        </div>
        <div className="glass-card p-8 flex flex-col items-center">
          <div className="text-4xl mb-4">🤖</div>
          <h3 className="text-xl font-bold mb-2">Eco-Pilot AI</h3>
          <p className="text-gray-400">Get personalized advice and answers to your sustainability questions.</p>
        </div>
      </div>

      <button 
        onClick={() => navigate('/marketplace')}
        className="btn btn-primary text-lg px-12 py-4 rounded-full shadow-lg hover:shadow-emerald-500/20"
      >
        Explore Marketplace
      </button>
    </div>
  );
};

export default Home;
