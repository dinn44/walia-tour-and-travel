import React from 'react';
import { Award, Compass, Heart, ShieldCheck } from 'lucide-react';

const AboutUs = () => {
  return (
    <div style={styles.about} className="animate-fade-in">
      <div style={styles.header}>
        <span className="badge badge-primary">DIN Atelier</span>
        <h1 style={styles.title}>Refined Essentials. Made for Life.</h1>
        <p style={styles.subtitle}>Uncompromising build quality, rigorous aesthetics, and timeless minimalist philosophy.</p>
      </div>

      <div style={styles.grid}>
        <div style={styles.textCol}>
          <h2>The Design Manifesto</h2>
          <p style={styles.para}>
            At DIN, we reject the cycles of planned obsolescence and temporary trends. We believe in designing architectural accessories that serve as functional extensions of your daily habits. Our curation process is highly meticulous: selecting only resilient Grade-A leather, Japanese quartz, Spun Solid Brass, and Titanium alloys.
          </p>
          <p style={styles.para}>
            Founded in 2026, DIN serves as a premium design atelier collaborating with precision manufacturers worldwide. By removing complex middle networks and maintaining standard in-house quality assurances, we produce and deliver world-class collectibles without markup padding.
          </p>
        </div>
        <div style={styles.imgCol}>
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800" 
            alt="Atelier" 
            style={styles.image}
          />
        </div>
      </div>

      <hr style={styles.divider} />

      <div style={styles.valuesGrid}>
        <div style={styles.valueCard} className="glass-panel">
          <Compass size={24} style={styles.icon} />
          <h4>Refined Simplicity</h4>
          <p style={styles.valText}>Focusing entirely on high-contrast form and structural utility. Every line serves an intention.</p>
        </div>
        <div style={styles.valueCard} className="glass-panel">
          <Award size={24} style={styles.icon} />
          <h4>Artisan Calibrations</h4>
          <p style={styles.valText}>Collaborating exclusively with master craftsmen and engineering specialists worldwide.</p>
        </div>
        <div style={styles.valueCard} className="glass-panel">
          <ShieldCheck size={24} style={styles.icon} />
          <h4>Sustainable Lifetimes</h4>
          <p style={styles.valText}>Utilizing durable materials to ensure each release is built to outlast generations.</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  about: {
    maxWidth: '1280px',
    margin: '40px auto',
    padding: '0 24px',
    paddingBottom: '80px'
  },
  header: {
    marginBottom: '48px',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '24px',
    textAlign: 'center'
  },
  title: {
    fontFamily: 'var(--font-heading)',
    fontSize: '2.5rem',
    fontWeight: 800,
    marginTop: '6px',
    letterSpacing: '-0.02em'
  },
  subtitle: {
    fontSize: '1rem',
    color: 'var(--text-secondary)',
    maxWidth: '600px',
    margin: '8px auto 0 auto'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: '60px',
    alignItems: 'center',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: '40px'
    }
  },
  textCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  para: {
    fontSize: '1rem',
    lineHeight: '1.7',
    color: 'var(--text-secondary)'
  },
  imgCol: {
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-md)',
    height: '400px'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  divider: {
    border: 'none',
    borderBottom: '1px solid var(--border-color)',
    margin: '60px 0'
  },
  valuesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '30px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr'
    }
  },
  valueCard: {
    padding: '30px',
    background: 'var(--bg-tertiary)',
    borderRadius: 'var(--radius-md)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px'
  },
  icon: {
    color: 'var(--accent)',
  },
  valText: {
    fontSize: '0.9rem',
    lineHeight: '1.6',
    color: 'var(--text-secondary)'
  }
};

export default AboutUs;
