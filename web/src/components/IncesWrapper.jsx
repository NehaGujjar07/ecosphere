// src/components/IncesWrapper.jsx
import React, { useState, useEffect } from 'react';

const IncesWrapper = () => {
  const [activeSite, setActiveSite] = useState(null);

  const sites = [
    { name: 'Amazon Shopping', url: 'https://www.amazon.in', icon: '📦' },
    { name: 'Flipkart Shopping', url: 'https://www.flipkart.com', icon: '🛍️' }
  ];

  useEffect(() => {
    // If activeSite is set, we'd normally inject the content.js here. 
    // Since we're in a browser, we'll simulate the "insight" appearing.
    if (activeSite) {
      const script = document.createElement('script');
      script.src = '/inces/content.js';
      script.async = true;
      document.body.appendChild(script);
      
      return () => {
        document.body.removeChild(script);
        const panel = document.getElementById('eco-floating-panel');
        if (panel) panel.remove();
      };
    }
  }, [activeSite]);

  return (
    <div className="glass-card mb-8 p-8 border border-emerald-500/10 bg-emerald-500/5 fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">🛍️ Shopping Assistant Integration</h3>
          <p className="text-gray-400 max-w-xl">
            Get instant sustainability scores on Amazon and Flipkart! Our intelligence layer analyzes materials, carbon impact, and suggests greener alternatives in real-time.
          </p>
        </div>
        <div className="flex gap-4">
           {sites.map(site => (
             <button 
               key={site.name}
               onClick={() => window.open(site.url, '_blank')}
               className="btn btn-secondary px-6 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-500/10 transition-all border border-white/5"
             >
               <span>{site.icon}</span> {site.name}
             </button>
           ))}
        </div>
      </div>
      
      <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row gap-8 items-center justify-center opacity-80 scale-95 origin-center">
         <div className="text-xs text-emerald-400 font-bold uppercase tracking-widest bg-emerald-500/10 px-4 py-2 rounded-full">
            Feature Integrated: INCES Browser Layer
         </div>
         <div className="text-xs text-gray-500 italic">
            *To use, ensure the backend is running and the intelligence layer is active.
         </div>
      </div>
    </div>
  );
};

export default IncesWrapper;
