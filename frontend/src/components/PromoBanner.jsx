import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';

const PromoBanner = () => {
  const [slideIndex, setSlideIndex] = useState(0);

  const promos = [
    {
      title: "INTRODUCING THE ONYX COLLECTION",
      subtitle: "Precision engineering meets ultra-matte finishes. Timepieces made for the absolute minimalist.",
      action: "Discover Chronographs",
      link: "/shop?category=Timepieces",
      tag: "Limited Release",
      color: "var(--accent)"
    },
    {
      title: "SUMMER ATELIER PREVIEW",
      subtitle: "Acquire hand-stitched suede couriers and leather boots. Complimentary priority worldwide shipping applied.",
      action: "Browse Handcrafted",
      link: "/shop?category=Leather Goods",
      tag: "Seasonal Exclusives",
      color: "var(--success)"
    },
    {
      title: "EXCLUSIVE VIP INVITATION",
      subtitle: "Apply coupon DINWELCOME10 at checkout to redeem a introductory 10% deduction on your first premium parcel.",
      action: "Redeem Welcome Discount",
      link: "/shop",
      tag: "Promotional Offer",
      color: "var(--warning)"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex(prev => (prev + 1) % promos.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = promos[slideIndex];

  return (
    <div className="glass-panel animate-fade-in" style={{ ...styles.banner, borderLeft: `6px solid ${slide.color}` }}>
      <div style={styles.grid}>
        <div style={styles.textContainer}>
          <div style={styles.badgeRow}>
            <span style={{ ...styles.badge, background: `${slide.color}20`, color: slide.color }}>
              <Sparkles size={12} />
              {slide.tag}
            </span>
          </div>
          <h2 style={styles.title}>{slide.title}</h2>
          <p style={styles.subtitle}>{slide.subtitle}</p>
          
          <Link to={slide.link} style={styles.actionBtn}>
            {slide.action}
            <ArrowRight size={16} />
          </Link>
        </div>

        <div style={styles.indicatorCol}>
          {promos.map((_, idx) => (
            <button 
              key={idx} 
              onClick={() => setSlideIndex(idx)}
              style={{
                ...styles.dot,
                background: idx === slideIndex ? slide.color : 'var(--border-color)',
                transform: idx === slideIndex ? 'scale(1.3)' : 'scale(1)'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  banner: {
    padding: '40px',
    borderRadius: 'var(--radius-lg)',
    background: 'var(--bg-tertiary)',
    boxShadow: 'var(--shadow-md)',
    overflow: 'hidden',
    position: 'relative',
    margin: '30px auto',
    maxWidth: '1280px',
    transition: 'var(--transition-smooth)'
  },
  grid: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '30px',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      alignItems: 'flex-start'
    }
  },
  textContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  badgeRow: {
    display: 'flex',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 12px',
    borderRadius: 'var(--radius-full)',
    fontSize: '0.7rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  title: {
    fontFamily: 'var(--font-heading)',
    fontSize: '2rem',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    color: 'var(--text-primary)',
    lineHeight: '1.1',
    '@media (max-width: 576px)': {
      fontSize: '1.5rem'
    }
  },
  subtitle: {
    fontSize: '1.05rem',
    lineHeight: '1.6',
    color: 'var(--text-secondary)',
    maxWidth: '700px'
  },
  actionBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: 600,
    fontSize: '0.95rem',
    color: 'var(--accent)',
    marginTop: '8px',
    transition: 'var(--transition-smooth)'
  },
  indicatorCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    '@media (max-width: 768px)': {
      flexDirection: 'row',
      marginTop: '10px'
    }
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    transition: 'var(--transition-spring)'
  }
};

export default PromoBanner;
