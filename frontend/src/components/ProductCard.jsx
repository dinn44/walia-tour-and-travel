import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Heart, ShoppingCart, Star } from 'lucide-react';

// Price Formatter Helper according to currency selection
export const formatPrice = (priceUSD, currency) => {
  const rates = { USD: 1.0, EUR: 0.92, GBP: 0.79 };
  const symbols = { USD: '$', EUR: '€', GBP: '£' };
  
  const converted = priceUSD * (rates[currency] || 1.0);
  const symbol = symbols[currency] || '$';
  
  return `${symbol}${converted.toFixed(2)}`;
};

const ProductCard = ({ product, currency = 'USD' }) => {
  const { user, toggleWishlist } = useAuth();
  const { addToCart } = useCart();

  const pid = product._id || product.id;
  const isWishlisted = user && user.wishlist && user.wishlist.some(
    item => (item._id || item.id || item) === pid
  );

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(pid);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div className="glass-panel hover-card" style={styles.card}>
      <Link to={`/products/${pid}`} style={{ display: 'block', position: 'relative' }}>
        {/* Product Image Panel */}
        <div style={styles.imageContainer} className="img-zoom-parent">
          <img 
            src={product.images && product.images[0]} 
            alt={product.title} 
            style={styles.image}
            className="img-zoom"
          />
          {/* Wishlist floating toggle */}
          <button 
            onClick={handleWishlist} 
            style={{
              ...styles.wishlistBtn,
              background: isWishlisted ? 'rgba(239, 68, 68, 0.1)' : 'var(--glass-bg)',
              color: isWishlisted ? '#ef4444' : 'var(--text-primary)'
            }}
            title="Add to Wishlist"
          >
            <Heart size={16} fill={isWishlisted ? "#ef4444" : "none"} />
          </button>

          {/* Low Stock Warning Badge */}
          {product.stock <= 5 && product.stock > 0 && (
            <span style={styles.stockBadge}>Only {product.stock} Left</span>
          )}
          {product.stock === 0 && (
            <span style={styles.outOfStockBadge}>Out of Stock</span>
          )}
        </div>

        {/* Content Details */}
        <div style={styles.details}>
          <p style={styles.brandCategory}>
            <span>{product.brand}</span>
            <span style={styles.dot}>•</span>
            <span>{product.category}</span>
          </p>

          <h3 style={styles.title}>{product.title}</h3>

          {/* Rating */}
          <div style={styles.ratingRow}>
            <div style={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={12} 
                  fill={i < Math.round(product.ratings || 5) ? "var(--warning)" : "none"}
                  stroke={i < Math.round(product.ratings || 5) ? "var(--warning)" : "var(--text-muted)"}
                />
              ))}
            </div>
            <span style={styles.ratingNum}>{product.ratings || '5.0'}</span>
          </div>

          {/* Price & Action Row */}
          <div style={styles.priceRow}>
            <span style={styles.price}>{formatPrice(product.price, currency)}</span>
            <button 
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              style={{
                ...styles.cartBtn,
                background: product.stock === 0 ? 'var(--border-color)' : 'var(--accent)'
              }}
              title="Add to Cart"
            >
              <ShoppingCart size={15} />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

const styles = {
  card: {
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    transition: 'var(--transition-spring)',
    position: 'relative'
  },
  imageContainer: {
    position: 'relative',
    paddingTop: '115%', // Elegant aspect ratio for products
    overflow: 'hidden',
    background: 'var(--bg-secondary)',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'var(--transition-smooth)'
  },
  wishlistBtn: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    width: '32px',
    height: '32px',
    borderRadius: 'var(--radius-full)',
    border: '1px solid var(--glass-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    transition: 'var(--transition-smooth)'
  },
  stockBadge: {
    position: 'absolute',
    bottom: '12px',
    left: '12px',
    background: 'rgba(245, 158, 11, 0.95)',
    color: '#ffffff',
    fontSize: '0.65rem',
    fontWeight: 700,
    padding: '3px 8px',
    borderRadius: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  outOfStockBadge: {
    position: 'absolute',
    bottom: '12px',
    left: '12px',
    background: 'rgba(239, 68, 68, 0.95)',
    color: '#ffffff',
    fontSize: '0.65rem',
    fontWeight: 700,
    padding: '3px 8px',
    borderRadius: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  details: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  brandCategory: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  dot: {
    fontSize: '1rem',
    lineHeight: '1'
  },
  title: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.05rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
    lineHeight: '1.3',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  stars: {
    display: 'flex',
    gap: '2px'
  },
  ratingNum: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--text-secondary)'
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '6px'
  },
  price: {
    fontSize: '1.15rem',
    fontWeight: 700,
    color: 'var(--text-primary)'
  },
  cartBtn: {
    width: '32px',
    height: '32px',
    borderRadius: 'var(--radius-sm)',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'var(--transition-smooth)'
  }
};

export default ProductCard;
