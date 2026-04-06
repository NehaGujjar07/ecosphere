// src/pages/Cart.jsx
import React, { useState, useEffect } from 'react';

const Cart = () => {
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('ecoCart') || '[]'));

  const calculateTotal = () => cart.reduce((acc, item) => acc + item.price, 0);
  const calculateCO2 = () => cart.reduce((acc, item) => acc + (item.material === 'plastic' ? 3.5 : 1.5), 0);

  const removeItem = (idx) => {
    const newCart = [...cart];
    newCart.splice(idx, 1);
    setCart(newCart);
    localStorage.setItem('ecoCart', JSON.stringify(newCart));
  };

  const handleCheckout = () => {
    // Sustainability Health Check before finalizing
    const highImpactCount = cart.filter(item => item.score < 40).length;
    if (highImpactCount > 0) {
      alert(`⚠️ Wait! We detected ${highImpactCount} high-impact item(s) in your cart. Please consider switching to more sustainable alternatives for a better CO2 reduction forecast.`);
    } else {
      alert("✅ Your cart is fully optimized! Points added to your profile.");
      setCart([]);
      localStorage.setItem('ecoCart', '[]');
    }
  };

  return (
    <div className="fade-in max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-white">Your Shopping Cart</h1>
      
      {cart.length === 0 ? (
        <div className="glass-card p-12 text-center text-gray-500">
           Your cart is empty. Explore the <a href="/marketplace" className="text-emerald-400 underline">Marketplace</a> to find sustainable products.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, idx) => (
              <div key={idx} className="glass-card p-6 flex justify-between items-center bg-white/5 border border-white/5">
                <div className="flex gap-4 items-center">
                  <img src={item.image} alt={item.title} className="w-16 h-16 rounded-lg object-cover" />
                  <div>
                    <h3 className="text-white font-bold">{item.title}</h3>
                    <p className="text-xs text-gray-400 uppercase tracking-tighter">{item.category} • {item.material}</p>
                  </div>
                </div>
                <div className="flex gap-8 items-center">
                  <div className="text-lg font-bold text-white">₹{item.price}</div>
                  <button onClick={() => removeItem(idx)} className="text-red-400 text-sm hover:text-red-300">Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="glass-card p-8 border border-emerald-500/10">
              <h3 className="text-xl font-bold mb-6 text-white text-center">Sustainability Health Check</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Total Items</span>
                  <span className="text-white font-bold">{cart.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Estimated Emissions</span>
                  <span className="text-emerald-400 font-bold">{calculateCO2().toFixed(1)} kg CO2</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Total Price</span>
                  <span className="text-white font-bold text-lg">₹{calculateTotal()}</span>
                </div>
              </div>
              <button 
                onClick={handleCheckout}
                className="w-full btn btn-primary py-4 rounded-xl font-bold shadow-lg shadow-emerald-500/20"
              >
                Proceed to Checkout
              </button>
            </div>

            <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
               <p className="text-xs text-emerald-400 italic text-center">
                  ✨ Tip: Switching even 1 high-impact item can improve your monthly CO2 forecast by 15%!
               </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
