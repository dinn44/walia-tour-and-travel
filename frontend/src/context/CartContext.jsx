import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token } = useAuth();
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('din_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeCoupon, setActiveCoupon] = useState(null);
  const [couponError, setCouponError] = useState(null);

  useEffect(() => {
    localStorage.setItem('din_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    const pid = product._id || product.id;
    setCart(prev => {
      const idx = prev.findIndex(item => (item.product._id || item.product.id) === pid);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx].quantity = Math.min(product.stock, updated[idx].quantity + quantity);
        return updated;
      }
      return [...prev, { product, quantity: Math.min(product.stock, quantity) }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => (item.product._id || item.product.id) !== productId));
  };

  const updateQty = (productId, qty) => {
    setCart(prev => {
      const idx = prev.findIndex(item => (item.product._id || item.product.id) === productId);
      if (idx > -1) {
        const updated = [...prev];
        const stock = updated[idx].product.stock;
        updated[idx].quantity = Math.max(1, Math.min(stock, qty));
        return updated;
      }
      return prev;
    });
  };

  const clearCart = () => {
    setCart([]);
    setActiveCoupon(null);
    setCouponError(null);
  };

  const applyCoupon = async (code) => {
    setCouponError(null);
    if (!token) {
      setCouponError('Please log in to apply coupons.');
      return { success: false };
    }
    
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      if (data.success) {
        setActiveCoupon(data.coupon);
        return { success: true, coupon: data.coupon };
      } else {
        setCouponError(data.message);
        return { success: false, message: data.message };
      }
    } catch (err) {
      setCouponError('Coupon check failed. Offline mode active.');
      return { success: false };
    }
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
    setCouponError(null);
  };

  // Math Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  
  let discount = 0;
  if (activeCoupon) {
    if (activeCoupon.discountPercent > 0) {
      discount = (subtotal * activeCoupon.discountPercent) / 100;
    } else if (activeCoupon.discountAmount > 0) {
      discount = Math.min(activeCoupon.discountAmount, subtotal);
    }
  }

  const total = parseFloat((subtotal - discount).toFixed(2));
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      applyCoupon,
      removeCoupon,
      activeCoupon,
      couponError,
      subtotal,
      discount,
      total,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
