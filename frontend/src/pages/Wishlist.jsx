import React from 'react';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Wishlist = ({ currency }) => {
  const { user, token } = useAuth();

  if (!token) {
    return (
      <div style={styles.loginRequired} className="glass-panel animate-fade-in">
        <Heart size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
        <h2>Wishlist Verification Needed</h2>
        <p>Please establish connection to your credentials account to catalog your favorited pieces.</p>
        <Link to="/login?redirect=wishlist" className="btn btn-primary" style={{ marginTop: '16px' }}>Sign In</Link>
      </div>
    );
  }

  const wishlist = user ? user.wishlist : [];

  if (wishlist.length === 0) {
    return (
      <div style={styles.emptyContainer} className="glass-panel animate-fade-in">
        <Heart size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
        <h2>Your Curated Wishlist is Vacant</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '8px auto 20px auto' }}>
          Select the heart icons on product thumbnails to register favorited pieces here.
        </p>
        <Link to="/shop" className="btn btn-primary">Discover Selections</Link>
      </div>
    );
  }

  return (
    <div style={styles.wishlist} className="animate-fade-in">
      <div style={styles.header}>
        <span className="badge badge-primary">Curated Registry</span>
        <h1 style={styles.title}>Your Refined Wishlist</h1>
      </div>

      <div className="products-grid animate-fade-in-up">
        {wishlist.map(prod => (
          <ProductCard key={prod._id || prod.id} product={prod} currency={currency} />
        ))}
      </div>
    </div>
  );
};

const styles = {
  wishlist: {
    maxWidth: '1280px',
    margin: '40px auto',
    padding: '0 24px',
    paddingBottom: '80px'
  },
  header: {
    marginBottom: '40px',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '24px'
  },
  title: {
    fontFamily: 'var(--font-heading)',
    fontSize: '2.5rem',
    fontWeight: 800,
    marginTop: '6px',
    letterSpacing: '-0.02em'
  },
  loginRequired: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '80px 20px',
    maxWidth: '500px',
    margin: '100px auto',
    background: 'var(--bg-tertiary)'
  },
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '80px 20px',
    maxWidth: '500px',
    margin: '100px auto',
    background: 'var(--bg-tertiary)'
  }
};

export default Wishlist;
