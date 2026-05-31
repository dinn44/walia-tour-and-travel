import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { User, Mail, Calendar, Heart, ShieldAlert, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = ({ currency }) => {
  const { user, token } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!token) return;
      try {
        const res = await fetch('/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setProfileData(data.user);
        }
      } catch (err) {
        console.warn('[Profile Page] Failed to fetch active profile details from server. Rendering cached context.');
        setProfileData(user);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [token, user]);

  if (!token) {
    return (
      <div style={styles.loginRequired} className="glass-panel animate-fade-in">
        <ShieldAlert size={48} style={{ color: 'var(--error)', marginBottom: '16px' }} />
        <h2>Profile Authentication Needed</h2>
        <p>Please establish connection to your credentials account to view your user dashboard details.</p>
        <Link to="/login" className="btn btn-primary" style={{ marginTop: '16px' }}>Sign In</Link>
      </div>
    );
  }

  if (loading || !profileData) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
      </div>
    );
  }

  return (
    <div style={styles.profile} className="animate-fade-in">
      <div style={styles.header}>
        <span className="badge badge-primary">User Console</span>
        <h1 style={styles.title}>Account Profile</h1>
      </div>

      <div style={styles.grid}>
        {/* Profile Info Details Panel */}
        <div className="glass-panel animate-fade-in-up" style={styles.infoCard}>
          <div style={styles.avatarRow}>
            <div style={styles.avatar}>
              <User size={32} />
            </div>
            <div>
              <h3>{profileData.name}</h3>
              <span className="badge badge-success" style={{ textTransform: 'capitalize' }}>
                <Award size={11} />
                {profileData.role} member
              </span>
            </div>
          </div>

          <hr style={styles.divider} />

          <div style={styles.detailsList}>
            <div style={styles.detailItem}>
              <Mail size={16} style={styles.detailIcon} />
              <div>
                <p style={styles.detailKey}>Email Address</p>
                <p style={styles.detailVal}>{profileData.email}</p>
              </div>
            </div>
            <div style={styles.detailItem}>
              <Calendar size={16} style={styles.detailIcon} />
              <div>
                <p style={styles.detailKey}>Member Since</p>
                <p style={styles.detailVal}>May 2026 (Verified)</p>
              </div>
            </div>
          </div>
          
          <Link to="/orders" className="btn btn-secondary" style={styles.ordersLink}>
            Review Order Timeline
          </Link>
        </div>

        {/* Wishlist grid items panel */}
        <div style={styles.wishlistSection}>
          <div style={styles.wishlistHeader}>
            <Heart size={20} style={{ color: '#ef4444' }} />
            <h2 style={{ fontSize: '1.4rem' }}>Your Curated Wishlist ({profileData.wishlist ? profileData.wishlist.length : 0})</h2>
          </div>

          {(!profileData.wishlist || profileData.wishlist.length === 0) ? (
            <div className="glass-panel" style={styles.emptyWishlist}>
              <Heart size={32} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
              <p style={{ color: 'var(--text-secondary)' }}>Your wishlisted releases list is empty.</p>
              <Link to="/shop" className="btn btn-primary" style={{ marginTop: '16px' }}>Discover Collection</Link>
            </div>
          ) : (
            <div className="products-grid">
              {profileData.wishlist.map(prod => (
                <ProductCard key={prod._id || prod.id} product={prod} currency={currency} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  profile: {
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
  grid: {
    display: 'grid',
    gridTemplateColumns: '380px 1fr',
    gap: '40px',
    alignItems: 'start',
    '@media (max-width: 992px)': {
      gridTemplateColumns: '1fr',
    }
  },
  infoCard: {
    padding: '30px',
    background: 'var(--bg-tertiary)',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  avatarRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  avatar: {
    width: '64px',
    height: '64px',
    borderRadius: 'var(--radius-full)',
    background: 'var(--bg-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--accent)',
    border: '1px solid var(--border-color)'
  },
  divider: {
    border: 'none',
    borderBottom: '1px solid var(--border-color)',
    margin: 0
  },
  detailsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  detailItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px'
  },
  detailIcon: {
    color: 'var(--text-muted)',
    marginTop: '2px'
  },
  detailKey: {
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--text-muted)'
  },
  detailVal: {
    fontSize: '0.95rem',
    fontWeight: 600,
    color: 'var(--text-primary)'
  },
  ordersLink: {
    width: '100%',
    textAlign: 'center',
    marginTop: '8px'
  },
  wishlistSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  wishlistHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  emptyWishlist: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '60px 20px',
    background: 'var(--bg-tertiary)'
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
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '120px 0'
  },
  loader: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '3px solid var(--border-color)',
    borderTopColor: 'var(--accent)',
    animation: 'pulseSlow 1.5s infinite linear'
  }
};

export default Profile;
