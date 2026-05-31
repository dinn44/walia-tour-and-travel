import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Import Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Import Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import AdminDashboard from './pages/AdminDashboard';

const App = () => {
  // Global Multilingual & Multicurrency States
  const [language, setLanguage] = useState(() => localStorage.getItem('din_lang') || 'EN');
  const [currency, setCurrency] = useState(() => localStorage.getItem('din_currency') || 'USD');

  const handleSetLanguage = (lang) => {
    localStorage.setItem('din_lang', lang);
    setLanguage(lang);
  };

  const handleSetCurrency = (curr) => {
    localStorage.setItem('din_currency', curr);
    setCurrency(curr);
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <div style={styles.appWrapper}>
            <Navbar 
              language={language} 
              setLanguage={handleSetLanguage} 
              currency={currency} 
              setCurrency={handleSetCurrency} 
            />
            
            <main style={styles.mainContent}>
              <Routes>
                <Route path="/" element={<Home currency={currency} />} />
                <Route path="/shop" element={<Shop currency={currency} />} />
                <Route path="/products/:id" element={<ProductDetails currency={currency} />} />
                <Route path="/cart" element={<Cart currency={currency} />} />
                <Route path="/checkout" element={<Checkout currency={currency} />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile currency={currency} />} />
                <Route path="/orders" element={<Orders currency={currency} />} />
                <Route path="/wishlist" element={<Wishlist currency={currency} />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/admin" element={<AdminDashboard currency={currency} />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

const styles = {
  appWrapper: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: 'var(--bg-primary)',
    transition: 'background-color 0.4s ease'
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  }
};

export default App;
