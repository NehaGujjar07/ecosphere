// src/pages/Marketplace.jsx
import React, { useState } from 'react';
import { products } from '../mock/products';
import { Dialog } from '@headlessui/react';
import IncesWrapper from '../components/IncesWrapper';

const Marketplace = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('ecoCart') || '[]'));

  const handleAddToCart = (product) => {
    if (product.score < 50) {
      setSelectedProduct(product);
      setIsModalOpen(true);
    } else {
      addToCart(product);
    }
  };

  const addToCart = (product) => {
    const newCart = [...cart, { ...product, quantity: 1, date: new Date().toISOString() }];
    setCart(newCart);
    localStorage.setItem('ecoCart', JSON.stringify(newCart));
    setIsModalOpen(false);
    alert(`${product.title} added to cart!`);
  };

  return (
    <div className="fade-in">
      <IncesWrapper />
      <h1 className="text-3xl font-bold mb-8 text-white underline decoration-emerald-500/30">Curated Collections</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="glass-card flex flex-col p-4">
            <div className="relative mb-4 group h-64 overflow-hidden rounded-lg">
              <img 
                src={product.image} 
                alt={product.title} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className={`absolute top-2 left-2 px-2 py-1 text-[10px] font-bold text-white rounded ${
                product.score < 50 ? 'bg-red-500' : 'bg-emerald-500'
              }`}>
                {product.badge}
              </div>
            </div>
            
            <div className="flex-1">
              <div className="text-emerald-400 text-xs font-semibold mb-1 uppercase tracking-wider">
                {product.category}
              </div>
              <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                {product.title}
              </h3>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold">₹{product.price}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded bg-opacity-10 ${
                  product.score > 70 ? 'text-emerald-400 bg-emerald-400' : 
                  product.score < 40 ? 'text-red-400 bg-red-400' : 'text-amber-400 bg-amber-400'
                }`}>
                  {product.score > 70 ? '+' : ''}{product.score - 50} Eco-Points
                </span>
              </div>
            </div>

            <button 
              onClick={() => handleAddToCart(product)}
              className={`w-full py-3 rounded-lg font-bold transition-all ${
                product.score < 40 ? 'btn-secondary opacity-80' : 'btn-primary'
              }`}
            >
              + ADD
            </button>
          </div>
        ))}
      </div>

      {/* Eco-Insight Modal */}
      <Dialog 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm glass-card p-8 border border-white/10 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <Dialog.Title className="text-2xl font-bold mb-4 text-white">Eco-Insight Warning</Dialog.Title>
            <Dialog.Description className="text-gray-400 mb-6 leading-relaxed">
              We detected a high environmental impact for <span className="text-white font-semibold">{selectedProduct?.title}</span>. 
              The material <span className="text-white font-semibold">({selectedProduct?.material})</span> contributes significantly to CO2 emissions.
            </Dialog.Description>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="btn btn-primary py-3 rounded-xl text-lg font-bold shadow-lg shadow-emerald-500/20"
              >
                Back to Shop
              </button>
              <button 
                onClick={() => addToCart(selectedProduct)}
                className="text-gray-500 underline text-sm hover:text-gray-300"
              >
                Add Anyway
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Marketplace;
