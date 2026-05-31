import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('din_token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Setup user details if token exists
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await fetch('/api/auth/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await res.json();
          if (data.success) {
            setUser(data.user);
          } else {
            // Expired/Invalid token
            logout();
          }
        } catch (err) {
          console.warn('[AuthContext] Profile fetch error, retaining local cached state.', err);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('din_token', data.token);
        setToken(data.token);
        setUser(data.user);
        return { success: true };
      } else {
        setError(data.message);
        return { success: false, message: data.message };
      }
    } catch (err) {
      setError('Connection failure. Please try again.');
      return { success: false, message: 'Server connection failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('din_token', data.token);
        setToken(data.token);
        setUser(data.user);
        return { success: true };
      } else {
        setError(data.message);
        return { success: false, message: data.message };
      }
    } catch (err) {
      setError('Connection failure. Please try again.');
      return { success: false, message: 'Server connection failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('din_token');
    setToken(null);
    setUser(null);
  };

  const toggleWishlist = async (productId) => {
    if (!token) return { success: false, message: 'Please log in to manage your wishlist' };
    try {
      const res = await fetch(`/api/auth/wishlist/${productId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setUser(prev => ({
          ...prev,
          wishlist: data.wishlist
        }));
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      // Offline Toggle Local Fallback
      if (user) {
        const hasItem = user.wishlist.some(p => p.id === productId || p._id === productId || p === productId);
        let updatedWish;
        if (hasItem) {
          updatedWish = user.wishlist.filter(p => p.id !== productId && p._id !== productId && p !== productId);
        } else {
          updatedWish = [...user.wishlist, productId];
        }
        setUser(prev => ({ ...prev, wishlist: updatedWish }));
        return { success: true };
      }
      return { success: false, message: 'Wishlist sync failed' };
    }
  };

  // Keep recently viewed history synchronized
  const addRecentlyViewed = async (product) => {
    if (!user) return;
    const pid = product.id || product._id;
    
    // Check local recently viewed
    const alreadyVisited = user.recentlyViewed.some(p => (p.id || p._id || p) === pid);
    if (alreadyVisited) return;

    setUser(prev => {
      const updated = [product, ...prev.recentlyViewed].slice(0, 5);
      return {
        ...prev,
        recentlyViewed: updated
      };
    });

    // Make async call to backend to update DB if connected
    try {
      await fetch(`/api/products/${pid}?userId=${user.id || user._id}`);
    } catch (e) {
      // Silently fall back
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, register, logout, toggleWishlist, addRecentlyViewed }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
