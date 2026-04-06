// src/pages/Settings.jsx
import React, { useState } from 'react';

const Settings = () => {
  const [apiKey, setApiKey] = useState('gsk_b1c3NDp...imov');
  const [theme, setTheme] = useState('dark');

  return (
    <div className="fade-in max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold mb-8 text-white">Project Settings</h1>
      
      <div className="glass-card p-8 space-y-6">
        <h3 className="text-xl font-bold text-white mb-4">API Configuration</h3>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Groq Llama-3 API Key</label>
          <div className="flex gap-4">
            <input 
              type="password" 
              value={apiKey}
              readOnly
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <button className="btn btn-secondary px-6 rounded-xl font-bold">Update</button>
          </div>
          <p className="text-xs text-emerald-400 mt-2">✨ Powered by Groq Llama-3 for real-time sustainability reasoning.</p>
        </div>
      </div>

      <div className="glass-card p-8 space-y-6">
        <h3 className="text-xl font-bold text-white mb-4">Integrations</h3>
        <div className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-xl">
          <div className="flex gap-4 items-center">
            <div className="text-2xl">🛍️</div>
            <div>
              <div className="text-white font-bold">INCES Shopping Layer</div>
              <div className="text-xs text-gray-400">Enabled for Amazon and Flipkart browsing</div>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="w-12 h-6 bg-emerald-500 rounded-full relative">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-8 space-y-6">
        <h3 className="text-xl font-bold text-white mb-4">Appearance</h3>
        <div className="flex gap-4">
          <button 
            onClick={() => setTheme('dark')}
            className={`flex-1 py-4 rounded-xl font-bold border ${
              theme === 'dark' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-white/5 border-white/5 text-gray-400'
            }`}
          >
            Dark Mode
          </button>
          <button 
            onClick={() => setTheme('light')}
            className={`flex-1 py-4 rounded-xl font-bold border ${
              theme === 'light' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-white/5 border-white/5 text-gray-400'
            }`}
          >
            Light Mode
          </button>
        </div>
      </div>

      <div className="text-center p-8 text-xs text-gray-600">
        Build Version: 2.1.0-web-alpha • EcoSphere Intelligence Layer
      </div>
    </div>
  );
};

export default Settings;
