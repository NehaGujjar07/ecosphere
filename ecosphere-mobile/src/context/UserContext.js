import React, { createContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';

export const UserContext = createContext();

// Cross-platform storage helper (localStorage on web, no-op fallback otherwise)
const Storage = {
  getItem: async (key) => {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem(key);
      }
      // On native, would use AsyncStorage — for now return null
      return null;
    } catch { return null; }
  },
  setItem: async (key, value) => {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(key, value);
      }
    } catch {}
  },
  removeItem: async (key) => {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(key);
      }
    } catch {}
  },
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // { id, email, name }
  const [ecoPoints, setEcoPoints] = useState(0);
  const [level, setLevel] = useState(null);
  const [badges, setBadges] = useState([]);
  const [allBadges, setAllBadges] = useState([]);
  const [co2Saved, setCo2Saved] = useState(0);
  const [wasteAvoided, setWasteAvoided] = useState(0);
  const [cart, setCart] = useState([]);
  
  const AVAILABLE_VOUCHERS = [
    { id: 1, title: '15% Off Organic Groceries', code: 'ECOFRUIT15', brand: 'FreshEarth', color: '#10B981', type: 'percent', discount: 15 },
    { id: 2, title: '₹200 Off Bamboo Home Decor', code: 'BAMBOO200', brand: 'EcoHome', color: '#3B82F6', type: 'flat', discount: 200 },
  ];
  const [claimedVouchers, setClaimedVouchers] = useState([]);

  const claimVoucher = (code) => {
    if (!claimedVouchers.includes(code)) {
      setClaimedVouchers(prev => [...prev, code]);
    }
  };

  // On app load, restore persisted session
  useEffect(() => {
    Storage.getItem('ecosphere_user').then(stored => {
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {}
      }
    });
  }, []);

  // When user logs in, persist to storage
  const loginUser = (userData) => {
    setUser(userData);
    Storage.setItem('ecosphere_user', JSON.stringify(userData));
  };

  // On logout, clear session
  const logoutUser = () => {
    setUser(null);
    setEcoPoints(0);
    setCo2Saved(0);
    setWasteAvoided(0);
    setLevel(null);
    setBadges([]);
    setCart([]);
    Storage.removeItem('ecosphere_user');
  };

  // Called by Dashboard to sync live data from backend
  const syncProfile = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`http://localhost:8000/api/game/profile/${user.id}`);
      const data = await res.json();
      
      // Update user name if it changed or was missing
      if (data.name && user.name !== data.name) {
        const updatedUser = { ...user, name: data.name };
        setUser(updatedUser);
        Storage.setItem('ecosphere_user', JSON.stringify(updatedUser));
      }

      setEcoPoints(data.total_points);
      setLevel(data.level);
      setBadges(data.badges);
      if (data.all_badges) {
        setAllBadges(data.all_badges);
      }
      if (data.savings) {
        setCo2Saved(data.savings.co2_saved);
        setWasteAvoided(data.savings.waste_avoided);
      }
    } catch (e) {
      console.warn('Could not sync profile:', e);
    }
  };

  // Cart helpers
  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const updateCartQuantity = (productId, delta) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === productId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null; // filter out later
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  return (
    <UserContext.Provider value={{
      user, loginUser, logoutUser,
      ecoPoints, level, badges, allBadges, syncProfile,
      co2Saved, wasteAvoided,
      cart, addToCart, updateCartQuantity, removeFromCart, clearCart,
      AVAILABLE_VOUCHERS, claimedVouchers, claimVoucher,
    }}>
      {children}
    </UserContext.Provider>
  );
};
