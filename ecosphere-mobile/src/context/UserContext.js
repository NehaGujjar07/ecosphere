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
  const [cart, setCart] = useState([]);

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
    } catch (e) {
      console.warn('Could not sync profile:', e);
    }
  };

  // Cart helpers
  const addToCart = (product, quantity) => {
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

  const clearCart = () => setCart([]);

  return (
    <UserContext.Provider value={{
      user, loginUser, logoutUser,
      ecoPoints, level, badges, syncProfile,
      cart, addToCart, clearCart,
    }}>
      {children}
    </UserContext.Provider>
  );
};
