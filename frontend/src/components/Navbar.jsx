import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Sun, 
  Moon, 
  Globe, 
  DollarSign, 
  LogOut,
  LayoutDashboard,
  Menu,
  X
} from 'lucide-react';

const Navbar = ({ language, setLanguage, currency, setCurrency }) => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Localization resources
  const translations = {
    EN: { shop: "Shop", about: "About Us", contact: "Contact", admin: "Admin", logout: "Logout", login: "Login" },
    ES: { shop: "Tienda", about: "Nosotros", contact: "Contacto", admin: "Admin", logout: "Salir", login: "Ingresar" },
    FR: { shop: "Boutique", about: "À Propos", contact: "Contact", admin: "Admin", logout: "Quitter", login: "Connexion" }
  };

  const t = translations[language] || translations.EN;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-panel sticky-nav animate-fade-in" style={styles.nav}>
      <div style={styles.navContainer}>
        {/* Brand Logo */}
        <Link to="/" style={styles.logo}>
          D I N
        </Link>

        {/* Desktop Nav Links */}
        <div style={styles.navLinks}>
          <Link to="/shop" style={styles.link}>{t.shop}</Link>
          <Link to="/about" style={styles.link}>{t.about}</Link>
          <Link to="/contact" style={styles.link}>{t.contact}</Link>
          
          {user && user.role === 'admin' && (
            <Link to="/admin" style={styles.adminLink}>
              <LayoutDashboard size={16} />
              {t.admin}
            </Link>
          )}
        </div>

        {/* Actions Controls (Theme, Language, Currency, Cart, User) */}
        <div style={styles.actions}>
          {/* Language Selector */}
          <div className="nav-dropdown-parent" style={styles.dropdownContainer}>
            <button style={styles.actionBtn} title="Language">
              <Globe size={18} />
              <span style={styles.label}>{language}</span>
            </button>
            <div className="glass-panel dropdown-menu" style={styles.dropdown}>
              <button onClick={() => setLanguage('EN')} style={styles.dropdownItem}>English</button>
              <button onClick={() => setLanguage('ES')} style={styles.dropdownItem}>Español</button>
              <button onClick={() => setLanguage('FR')} style={styles.dropdownItem}>Français</button>
            </div>
          </div>

          {/* Currency Selector */}
          <div className="nav-dropdown-parent" style={styles.dropdownContainer}>
            <button style={styles.actionBtn} title="Currency">
              <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{currency}</span>
            </button>
            <div className="glass-panel dropdown-menu" style={styles.dropdown}>
              <button onClick={() => setCurrency('USD')} style={styles.dropdownItem}>USD ($)</button>
              <button onClick={() => setCurrency('EUR')} style={styles.dropdownItem}>EUR (€)</button>
              <button onClick={() => setCurrency('GBP')} style={styles.dropdownItem}>GBP (£)</button>
            </div>
          </div>

          {/* Theme Toggle */}
          <button onClick={toggleTheme} style={styles.actionBtn} title="Toggle Theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Wishlist */}
          <Link to="/wishlist" style={styles.actionBtn} title="Wishlist">
            <Heart size={18} />
            {user && user.wishlist && user.wishlist.length > 0 && (
              <span style={styles.badge}>{user.wishlist.length}</span>
            )}
          </Link>

          {/* Cart */}
          <Link to="/cart" style={styles.actionBtn} title="Shopping Cart">
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span style={styles.badgePrimary}>{cartCount}</span>
            )}
          </Link>

          {/* User Account / Login */}
          {user ? (
            <div className="nav-dropdown-parent" style={styles.dropdownContainer}>
              <button style={styles.actionBtn} title="Profile">
                <User size={18} />
              </button>
              <div className="glass-panel dropdown-menu" style={styles.dropdown}>
                <div style={styles.dropdownHeader}>
                  <p style={{ fontWeight: 600 }}>{user.name}</p>
                  <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>{user.email}</p>
                </div>
                <Link to="/profile" style={styles.dropdownItem}>My Profile</Link>
                <Link to="/orders" style={styles.dropdownItem}>Order History</Link>
                <hr style={{ border: 'none', borderBottom: '1px solid var(--border-color)', margin: '4px 0' }} />
                <button onClick={handleLogout} style={{ ...styles.dropdownItem, color: 'var(--error)' }}>
                  <LogOut size={14} style={{ marginRight: '6px' }} />
                  {t.logout}
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" style={styles.loginBtn}>
              {t.login}
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={styles.mobileToggle}>
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="glass-panel" style={styles.mobileMenu}>
          <Link to="/shop" onClick={() => setMobileMenuOpen(false)} style={styles.mobileLink}>{t.shop}</Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} style={styles.mobileLink}>{t.about}</Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)} style={styles.mobileLink}>{t.contact}</Link>
          
          {user && user.role === 'admin' && (
            <Link to="/admin" onClick={() => setMobileMenuOpen(false)} style={styles.mobileAdminLink}>
              <LayoutDashboard size={16} />
              {t.admin} Dashboard
            </Link>
          )}

          <hr style={{ border: 'none', borderBottom: '1px solid var(--border-color)', margin: '16px 0' }} />
          {user ? (
            <>
              <p style={styles.mobileUserHeader}>Signed in as: <strong>{user.name}</strong></p>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} style={styles.mobileLink}>My Profile</Link>
              <Link to="/orders" onClick={() => setMobileMenuOpen(false)} style={styles.mobileLink}>My Orders</Link>
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} style={styles.mobileLogoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={styles.mobileLoginBtn}>
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

// Inline premium styling helper
const styles = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    padding: '16px 24px',
    borderRadius: 0,
    borderBottom: '1px solid var(--border-color)',
    background: 'var(--glass-bg)',
    backdropFilter: 'blur(16px)',
    transition: 'background-color 0.4s ease'
  },
  navContainer: {
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.6rem',
    fontWeight: 800,
    color: 'var(--text-primary)',
    letterSpacing: '0.2em'
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    '@media (max-width: 768px)': {
      display: 'none'
    }
  },
  link: {
    fontSize: '0.95rem',
    fontWeight: 500,
    color: 'var(--text-secondary)'
  },
  adminLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.9rem',
    fontWeight: 600,
    color: 'var(--accent)'
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  dropdownContainer: {
    position: 'relative',
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '8px',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-secondary)',
    position: 'relative'
  },
  label: {
    fontSize: '0.75rem',
    fontWeight: 700,
    marginLeft: '2px'
  },
  badge: {
    position: 'absolute',
    top: '-2px',
    right: '-2px',
    background: 'var(--border-color)',
    color: 'var(--text-primary)',
    fontSize: '0.65rem',
    fontWeight: 700,
    borderRadius: 'var(--radius-full)',
    width: '15px',
    height: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid var(--bg-primary)'
  },
  badgePrimary: {
    position: 'absolute',
    top: '-2px',
    right: '-2px',
    background: 'var(--accent)',
    color: '#ffffff',
    fontSize: '0.65rem',
    fontWeight: 700,
    borderRadius: 'var(--radius-full)',
    width: '15px',
    height: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid var(--bg-primary)'
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: '100%',
    marginTop: '8px',
    width: '180px',
    borderRadius: 'var(--radius-md)',
    padding: '6px',
    boxShadow: 'var(--shadow-lg)',
    display: 'none',
    zIndex: 110,
    textAlign: 'left'
  },
  dropdownHeader: {
    padding: '8px 12px',
    borderBottom: '1px solid var(--border-color)',
    marginBottom: '4px'
  },
  dropdownItem: {
    display: 'block',
    width: '100%',
    padding: '8px 12px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.85rem',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    textAlign: 'left',
    transition: 'var(--transition-smooth)'
  },
  loginBtn: {
    background: 'var(--text-primary)',
    color: 'var(--bg-primary)',
    padding: '8px 16px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.85rem',
    fontWeight: 600,
    marginLeft: '6px'
  },
  mobileToggle: {
    display: 'none',
    color: 'var(--text-primary)',
    marginLeft: '6px'
  },
  mobileMenu: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    position: 'absolute',
    top: '100%',
    left: '24px',
    right: '24px',
    marginTop: '12px',
    padding: '24px',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-lg)',
    zIndex: 120
  },
  mobileLink: {
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
    padding: '8px 0'
  },
  mobileAdminLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '1rem',
    fontWeight: 700,
    color: 'var(--accent)',
    padding: '8px 0'
  },
  mobileUserHeader: {
    fontSize: '0.85rem',
    opacity: 0.8,
    marginBottom: '4px'
  },
  mobileLogoutBtn: {
    display: 'block',
    textAlign: 'center',
    width: '100%',
    background: 'rgba(239, 68, 68, 0.1)',
    color: 'var(--error)',
    padding: '10px',
    borderRadius: 'var(--radius-md)',
    fontWeight: 600,
    marginTop: '10px'
  },
  mobileLoginBtn: {
    display: 'block',
    textAlign: 'center',
    width: '100%',
    background: 'var(--text-primary)',
    color: 'var(--bg-primary)',
    padding: '10px',
    borderRadius: 'var(--radius-md)',
    fontWeight: 600,
    marginTop: '10px'
  }
};

export default Navbar;
