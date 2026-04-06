// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import Cart from './pages/Cart';
import Dashboard from './pages/Dashboard';
import EcoPilot from './pages/EcoPilot';
import Settings from './pages/Settings';
import './theme/theme.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Navigation Bar */}
        <nav className="glass-card m-4 p-4 flex justify-between items-center sticky top-0 z-50">
          <Link to="/" className="text-2xl font-bold text-emerald-500">EcoSphere</Link>
          <div className="flex gap-6 items-center">
            <Link to="/marketplace" className="hover:text-emerald-400 transition-colors">Market</Link>
            <Link to="/dashboard" className="hover:text-emerald-400 transition-colors">Dashboard</Link>
            <Link to="/ecopilot" className="hover:text-emerald-400 transition-colors">Eco-Pilot</Link>
            <Link to="/cart" className="relative hover:text-emerald-400 transition-colors">
              🛒 Cart
            </Link>
            <Link to="/settings" className="hover:text-emerald-400 transition-colors">⚙️</Link>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-4 max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ecopilot" element={<EcoPilot />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="p-8 text-center text-gray-500 text-sm">
          © 2026 EcoSphere. Built with sustainability in mind.
        </footer>
      </div>
    </Router>
  );
}

export default App;
