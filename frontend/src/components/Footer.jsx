import React, { useState } from 'react';
import { Mail, Check } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Info Column */}
        <div style={styles.col}>
          <h2 style={styles.logo}>D I N</h2>
          <p style={styles.tagline}>Elevated essentials for modern living. Curating exquisite minimalist watches, leather goods, eyewear, and home pieces.</p>
          <div style={styles.payBadges}>
            <span style={styles.payBadge}>Stripe Secure</span>
            <span style={styles.payBadge}>Visa</span>
            <span style={styles.payBadge}>Mastercard</span>
            <span style={styles.payBadge}>Apple Pay</span>
          </div>
        </div>

        {/* Links Columns */}
        <div style={styles.col}>
          <h3 style={styles.heading}>Collections</h3>
          <ul style={styles.list}>
            <li><a href="/shop?category=Timepieces" style={styles.link}>Timepieces</a></li>
            <li><a href="/shop?category=Leather Goods" style={styles.link}>Leather Goods</a></li>
            <li><a href="/shop?category=Eyewear" style={styles.link}>Eyewear</a></li>
            <li><a href="/shop?category=Apparel" style={styles.link}>Premium Apparel</a></li>
          </ul>
        </div>

        <div style={styles.col}>
          <h3 style={styles.heading}>Support</h3>
          <ul style={styles.list}>
            <li><a href="/about" style={styles.link}>Our Story</a></li>
            <li><a href="/contact" style={styles.link}>Contact Us</a></li>
            <li><a href="#" style={styles.link}>Shipping & Returns</a></li>
            <li><a href="#" style={styles.link}>Privacy Policy</a></li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div style={styles.colNewsletter}>
          <h3 style={styles.heading}>Newsletter</h3>
          <p style={styles.newsletterText}>Subscribe to receive early releases, exclusive events, and 10% off your introductory purchase.</p>
          
          <form onSubmit={handleSubscribe} style={styles.form}>
            <div style={styles.inputContainer}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
              <button type="submit" style={styles.btn}>
                {subscribed ? <Check size={18} /> : <Mail size={18} />}
              </button>
            </div>
          </form>
          {subscribed && <p style={styles.successMsg}>Thank you. Welcome to the DIN Circle.</p>}
        </div>
      </div>

      <div style={styles.bottom}>
        <p>© 2026 DIN E-commerce Platform. All rights reserved. Precision Crafted.</p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    background: 'var(--bg-secondary)',
    borderTop: '1px solid var(--border-color)',
    padding: '80px 24px 40px 24px',
    marginTop: 'auto',
    transition: 'background-color 0.4s ease'
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 2fr',
    gap: '40px',
    '@media (max-width: 992px)': {
      gridTemplateColumns: '1fr 1fr',
    },
    '@media (max-width: 576px)': {
      gridTemplateColumns: '1fr',
    }
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  colNewsletter: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  logo: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.5rem',
    fontWeight: 800,
    letterSpacing: '0.2em'
  },
  tagline: {
    fontSize: '0.9rem',
    lineHeight: '1.6',
    color: 'var(--text-secondary)'
  },
  heading: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: '8px'
  },
  list: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  link: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
  },
  payBadges: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '8px'
  },
  payBadge: {
    fontSize: '0.7rem',
    fontWeight: 600,
    padding: '4px 8px',
    borderRadius: '4px',
    border: '1px solid var(--border-color)',
    background: 'var(--bg-tertiary)',
    color: 'var(--text-secondary)'
  },
  newsletterText: {
    fontSize: '0.9rem',
    lineHeight: '1.6',
    color: 'var(--text-secondary)'
  },
  form: {
    width: '100%'
  },
  inputContainer: {
    display: 'flex',
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
    border: '1px solid var(--border-color)',
    background: 'var(--bg-tertiary)',
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    background: 'none',
    border: 'none',
    color: 'var(--text-primary)',
    fontSize: '0.9rem'
  },
  btn: {
    background: 'var(--accent)',
    color: '#ffffff',
    padding: '0 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'var(--transition-smooth)'
  },
  successMsg: {
    fontSize: '0.85rem',
    color: 'var(--success)',
    fontWeight: 500
  },
  bottom: {
    maxWidth: '1280px',
    margin: '40px auto 0 auto',
    paddingTop: '30px',
    borderTop: '1px solid var(--border-color)',
    textAlign: 'center',
    fontSize: '0.85rem',
    color: 'var(--text-muted)'
  }
};

export default Footer;
