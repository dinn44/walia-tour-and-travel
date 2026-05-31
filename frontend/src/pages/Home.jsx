import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PromoBanner from '../components/PromoBanner';
import ProductCard from '../components/ProductCard';
import { ArrowRight, ShoppingBag, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

const Home = ({ currency }) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Backup seed products in case server is not running yet during first paint
  const backupProducts = [
    {
      _id: "prod-1",
      title: "Minimalist Chronograph Onyx",
      price: 185.00,
      category: "Timepieces",
      brand: "DIN Signature",
      images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800"],
      stock: 24,
      ratings: 4.8
    },
    {
      _id: "prod-2",
      title: "Lux Suede Courier Bag",
      price: 320.00,
      category: "Leather Goods",
      brand: "DIN Atelier",
      images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800"],
      stock: 12,
      ratings: 4.9
    },
    {
      _id: "prod-3",
      title: "AeroPolar Sunglasses",
      price: 145.00,
      category: "Eyewear",
      brand: "DIN Optics",
      images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800"],
      stock: 35,
      ratings: 4.6
    },
    {
      _id: "prod-4",
      title: "Signature Cashmere Knit",
      price: 210.00,
      category: "Apparel",
      brand: "DIN Lounge",
      images: ["https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&q=80&w=800"],
      stock: 18,
      ratings: 4.7
    }
  ];

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success && data.products.length > 0) {
          setFeaturedProducts(data.products.slice(0, 4));
        } else {
          setFeaturedProducts(backupProducts);
        }
      } catch (err) {
        console.warn('[Home Page] Failed to fetch products from backend, falling back to offline catalogs.');
        setFeaturedProducts(backupProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const categories = [
    { name: "Timepieces", count: "12 Items", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600" },
    { name: "Leather Goods", count: "8 Items", img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600" },
    { name: "Eyewear", count: "15 Items", img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600" },
    { name: "Premium Apparel", count: "24 Items", img: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=600" }
  ];

  return (
    <div style={styles.home} className="animate-fade-in">
      {/* Hero section */}
      <header style={styles.hero}>
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContent} className="animate-fade-in-up">
          <p style={styles.heroSubtitle}>C U R A T E D   E S S E N T I A L S</p>
          <h1 style={styles.heroTitle}>Precision Crafted <br/>Modern Luxury</h1>
          <p style={styles.heroText}>A collection of handpicked, state-of-the-art essentials designed to elevate your everyday routines. Seamless. Minimal. Perfect.</p>
          <div style={styles.heroActions}>
            <Link to="/shop" className="btn btn-primary" style={styles.heroBtn}>
              <ShoppingBag size={18} />
              Acquire Collection
            </Link>
            <Link to="/about" className="btn btn-secondary" style={styles.heroBtnSec}>
              Our Craft
            </Link>
          </div>
        </div>
      </header>

      {/* Trust factors */}
      <section style={styles.trustSection}>
        <div style={styles.trustContainer}>
          <div style={styles.trustCard}>
            <Truck size={24} style={styles.trustIcon} />
            <h4 style={styles.trustTitle}>Priority Express Dispatch</h4>
            <p style={styles.trustText}>Complimentary signature delivery and express air-freight on all global selections.</p>
          </div>
          <div style={styles.trustCard}>
            <ShieldCheck size={24} style={styles.trustIcon} />
            <h4 style={styles.trustTitle}>Secure Stripe Payment</h4>
            <p style={styles.trustText}>Fully encrypted Stripe protocol safeguarding credentials and transaction pipelines.</p>
          </div>
          <div style={styles.trustCard}>
            <RefreshCw size={24} style={styles.trustIcon} />
            <h4 style={styles.trustTitle}>Artisan Guarantee</h4>
            <p style={styles.trustText}>A 30-day effortless return window and full lifetime warranty on hardware builds.</p>
          </div>
        </div>
      </section>

      {/* Promos */}
      <PromoBanner />

      {/* Featured Products */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <span className="badge badge-primary">Acquire Today</span>
            <h2 style={styles.sectionTitle}>Curated Releases</h2>
          </div>
          <Link to="/shop" style={styles.viewAll}>
            View Catalog
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.loader}></div>
          </div>
        ) : (
          <div className="products-grid">
            {featuredProducts.map(prod => (
              <ProductCard key={prod._id || prod.id} product={prod} currency={currency} />
            ))}
          </div>
        )}
      </section>

      {/* Categories Grid */}
      <section style={styles.categorySection}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="badge badge-success">Handpicked Collections</span>
          <h2 style={styles.sectionTitle}>Shop by Category</h2>
        </div>

        <div style={styles.catGrid}>
          {categories.map((cat, i) => (
            <Link 
              to={`/shop?category=${cat.name === 'Premium Apparel' ? 'Apparel' : cat.name}`} 
              key={i} 
              style={{ ...styles.catCard, backgroundImage: `url(${cat.img})` }}
              className="img-zoom-parent"
            >
              <div style={styles.catOverlay}></div>
              <div style={styles.catContent}>
                <h3 style={styles.catName}>{cat.name}</h3>
                <span style={styles.catCount}>{cat.count}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

const styles = {
  home: {
    paddingBottom: '80px',
  },
  hero: {
    position: 'relative',
    height: '80vh',
    minHeight: '550px',
    backgroundImage: 'url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1600)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    padding: '0 24px'
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to right, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.3) 100%)',
    zIndex: 1
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '680px',
    width: '100%',
    margin: '0 auto',
    padding: '0 10px',
    textAlign: 'center',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  heroSubtitle: {
    fontSize: '0.85rem',
    fontWeight: 700,
    letterSpacing: '0.4em',
    color: 'var(--accent)',
    marginBottom: '16px',
    textShadow: '0 2px 4px rgba(0,0,0,0.5)'
  },
  heroTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: '3.5rem',
    fontWeight: 800,
    lineHeight: '1.1',
    color: '#ffffff',
    marginBottom: '20px',
    textShadow: '0 4px 8px rgba(0,0,0,0.5)',
    '@media (max-width: 576px)': {
      fontSize: '2.5rem'
    }
  },
  heroText: {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    color: 'rgba(255,255,255,0.85)',
    marginBottom: '32px',
    textShadow: '0 2px 4px rgba(0,0,0,0.5)'
  },
  heroActions: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  heroBtn: {
    padding: '14px 28px',
    fontSize: '1rem',
    textShadow: 'none'
  },
  heroBtnSec: {
    padding: '14px 28px',
    fontSize: '1rem',
    border: '1px solid rgba(255,255,255,0.4)',
    color: '#ffffff',
    textShadow: 'none'
  },
  trustSection: {
    padding: '60px 24px',
    borderBottom: '1px solid var(--border-color)',
    background: 'var(--bg-secondary)',
    transition: 'background-color 0.4s ease'
  },
  trustContainer: {
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '30px',
    '@media (max-width: 992px)': {
      gridTemplateColumns: '1fr',
      textAlign: 'center'
    }
  },
  trustCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    alignItems: 'center',
    textAlign: 'center',
    padding: '10px'
  },
  trustIcon: {
    color: 'var(--accent)',
    marginBottom: '8px'
  },
  trustTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.1rem',
    fontWeight: 600
  },
  trustText: {
    fontSize: '0.9rem',
    lineHeight: '1.6',
    color: 'var(--text-secondary)'
  },
  section: {
    maxWidth: '1280px',
    margin: '80px auto',
    padding: '0 24px'
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: '40px',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '16px'
  },
  sectionTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: '2rem',
    fontWeight: 700,
    marginTop: '6px'
  },
  viewAll: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontWeight: 600,
    color: 'var(--accent)',
    fontSize: '0.95rem'
  },
  categorySection: {
    maxWidth: '1280px',
    margin: '80px auto 40px auto',
    padding: '0 24px'
  },
  catGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
    '@media (max-width: 992px)': {
      gridTemplateColumns: '1fr 1fr',
    },
    '@media (max-width: 576px)': {
      gridTemplateColumns: '1fr',
    }
  },
  catCard: {
    position: 'relative',
    height: '350px',
    borderRadius: 'var(--radius-md)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'flex-end',
    padding: '24px',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-sm)',
    color: '#ffffff'
  },
  catOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 10%, rgba(0,0,0,0.1) 60%)',
    zIndex: 1
  },
  catContent: {
    position: 'relative',
    zIndex: 2,
  },
  catName: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#ffffff'
  },
  catCount: {
    fontSize: '0.8rem',
    fontWeight: 600,
    opacity: 0.8,
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '80px 0'
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

export default Home;
