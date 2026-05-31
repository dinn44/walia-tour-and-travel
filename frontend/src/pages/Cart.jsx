import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../components/ProductCard';
import { Trash2, ShoppingBag, ArrowRight, Tag, X } from 'lucide-react';

const Cart = ({ currency }) => {
  const { 
    cart, 
    updateQty, 
    removeFromCart, 
    subtotal, 
    discount, 
    total, 
    applyCoupon, 
    removeCoupon, 
    activeCoupon, 
    couponError 
  } = useCart();
  const { token } = useAuth();
  
  const [couponCode, setCouponCode] = useState('');
  const [couponSubmitting, setCouponSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    if (!couponCode) return;
    setCouponSubmitting(true);
    await applyCoupon(couponCode);
    setCouponCode('');
    setCouponSubmitting(false);
  };

  const handleCheckoutClick = () => {
    if (token) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <div style={styles.emptyCart} className="glass-panel animate-fade-in">
        <ShoppingBag size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
        <h2>Your Cart is Unoccupied</h2>
        <p style={{ maxWidth: '400px', margin: '8px auto 24px auto', color: 'var(--text-secondary)' }}>
          Acquire fine minimal watches, luxury leather goods, and refined accessories to stock your cart inventory.
        </p>
        <Link to="/shop" className="btn btn-primary">Browse Exhibition</Link>
      </div>
    );
  }

  return (
    <div style={styles.cart} className="animate-fade-in">
      <div style={styles.header}>
        <span className="badge badge-primary">Acquisitions Cart</span>
        <h1 style={styles.title}>Your Shopping Cart</h1>
      </div>

      <div style={styles.grid}>
        {/* Cart items list */}
        <div style={styles.itemsCol}>
          {cart.map((item) => {
            const product = item.product;
            const pid = product._id || product.id;
            
            return (
              <div key={pid} className="glass-panel" style={styles.cartItem}>
                <img 
                  src={product.images && product.images[0]} 
                  alt={product.title} 
                  style={styles.itemImage}
                />
                
                <div style={styles.itemDetails}>
                  <div>
                    <span style={styles.itemBrand}>{product.brand}</span>
                    <h3 style={styles.itemTitle}>
                      <Link to={`/products/${pid}`}>{product.title}</Link>
                    </h3>
                  </div>
                  
                  <span style={styles.itemPriceSingle}>{formatPrice(product.price, currency)}</span>
                </div>

                <div style={styles.itemActions}>
                  {/* Quantity adjustments */}
                  <div style={styles.qtyContainer}>
                    <button 
                      onClick={() => updateQty(pid, item.quantity - 1)} 
                      style={styles.qtyBtn}
                    >-</button>
                    <span style={styles.qtyVal}>{item.quantity}</span>
                    <button 
                      onClick={() => updateQty(pid, item.quantity + 1)} 
                      style={styles.qtyBtn}
                    >+</button>
                  </div>

                  {/* Item Total Price */}
                  <span style={styles.itemTotalVal}>
                    {formatPrice(product.price * item.quantity, currency)}
                  </span>

                  {/* Remove */}
                  <button 
                    onClick={() => removeFromCart(pid)} 
                    style={styles.removeBtn}
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Totals panel card */}
        <div className="glass-panel" style={styles.totalsCard}>
          <h3 style={styles.totalsHeading}>Acquisitions Summary</h3>
          
          <div style={styles.summaryTable}>
            <div style={styles.summaryRow}>
              <span>Subtotal</span>
              <span>{formatPrice(subtotal, currency)}</span>
            </div>
            
            {discount > 0 && (
              <div style={{ ...styles.summaryRow, color: 'var(--success)' }}>
                <span>Coupon Deduction</span>
                <span>-{formatPrice(discount, currency)}</span>
              </div>
            )}

            <div style={styles.summaryRow}>
              <span>Shipping Delivery</span>
              <span style={{ color: 'var(--success)', fontWeight: 600 }}>FREE</span>
            </div>

            <hr style={styles.divider} />

            <div style={styles.totalRow}>
              <span>Grand Total</span>
              <span>{formatPrice(total, currency)}</span>
            </div>
          </div>

          {/* Coupon codes box */}
          <div style={styles.couponSection}>
            {activeCoupon ? (
              <div style={styles.activeCouponBox}>
                <div style={styles.couponInfo}>
                  <Tag size={14} style={{ color: 'var(--success)' }} />
                  <div>
                    <p style={styles.activeCouponCode}>{activeCoupon.code}</p>
                    <p style={styles.activeCouponDesc}>{activeCoupon.description}</p>
                  </div>
                </div>
                <button onClick={removeCoupon} style={styles.removeCouponBtn}>
                  <X size={14} />
                </button>
              </div>
            ) : (
              <form onSubmit={handleCouponSubmit} style={styles.couponForm}>
                <input 
                  type="text" 
                  placeholder="Promo Code (e.g. DINWELCOME10)" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  style={styles.couponInput}
                />
                <button type="submit" disabled={couponSubmitting} style={styles.couponBtn}>
                  Apply
                </button>
              </form>
            )}
            {couponError && <p style={styles.couponErrorMsg}>{couponError}</p>}
          </div>

          <button onClick={handleCheckoutClick} className="btn btn-primary" style={styles.checkoutBtn}>
            Proceed to Checkout
            <ArrowRight size={18} />
          </button>
          
          <Link to="/shop" style={styles.continueShop}>
            Continue Discoveries
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  cart: {
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
    gridTemplateColumns: '1.6fr 1fr',
    gap: '32px',
    alignItems: 'start',
    '@media (max-width: 992px)': {
      gridTemplateColumns: '1fr',
    }
  },
  itemsCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  cartItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '16px',
    background: 'var(--bg-tertiary)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-sm)',
    '@media (max-width: 600px)': {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '12px'
    }
  },
  itemImage: {
    width: '90px',
    height: '90px',
    borderRadius: 'var(--radius-sm)',
    objectFit: 'cover',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    '@media (max-width: 600px)': {
      width: '100%',
      height: '180px'
    }
  },
  itemDetails: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  itemBrand: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--accent)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  itemTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.05rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
    lineHeight: '1.3'
  },
  itemPriceSingle: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    fontWeight: 500
  },
  itemActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    justifyContent: 'space-between',
    width: 'auto',
    '@media (max-width: 600px)': {
      width: '100%',
      borderTop: '1px solid var(--border-color)',
      paddingTop: '12px',
      marginTop: '4px'
    }
  },
  qtyContainer: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--bg-secondary)',
    height: '34px',
    overflow: 'hidden'
  },
  qtyBtn: {
    width: '30px',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--text-secondary)'
  },
  qtyVal: {
    padding: '0 8px',
    fontWeight: 700,
    fontSize: '0.9rem',
    minWidth: '24px',
    textAlign: 'center'
  },
  itemTotalVal: {
    fontSize: '1.05rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    minWidth: '70px',
    textAlign: 'right'
  },
  removeBtn: {
    color: 'var(--text-muted)',
    transition: 'var(--transition-smooth)',
    display: 'flex',
    alignItems: 'center'
  },
  totalsCard: {
    padding: '30px',
    background: 'var(--bg-tertiary)',
    boxShadow: 'var(--shadow-md)'
  },
  totalsHeading: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.25rem',
    fontWeight: 700,
    marginBottom: '20px'
  },
  summaryTable: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.95rem',
    color: 'var(--text-secondary)'
  },
  divider: {
    border: 'none',
    borderBottom: '1px solid var(--border-color)',
    margin: '4px 0'
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '1.2rem',
    fontWeight: 700,
    color: 'var(--text-primary)'
  },
  couponSection: {
    marginTop: '24px',
    marginBottom: '16px'
  },
  couponForm: {
    display: 'flex',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-sm)',
    overflow: 'hidden'
  },
  couponInput: {
    flex: 1,
    padding: '10px 12px',
    background: 'var(--bg-secondary)',
    border: 'none',
    color: 'var(--text-primary)',
    fontSize: '0.85rem'
  },
  couponBtn: {
    background: 'var(--text-primary)',
    color: 'var(--bg-primary)',
    padding: '0 16px',
    fontWeight: 600,
    fontSize: '0.85rem'
  },
  activeCouponBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 14px',
    background: 'rgba(16, 185, 129, 0.05)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    borderRadius: 'var(--radius-sm)'
  },
  couponInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  activeCouponCode: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: 'var(--success)'
  },
  activeCouponDesc: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)'
  },
  removeCouponBtn: {
    color: 'var(--text-muted)'
  },
  couponErrorMsg: {
    fontSize: '0.8rem',
    color: 'var(--error)',
    marginTop: '6px',
    fontWeight: 500
  },
  checkoutBtn: {
    width: '100%',
    height: '48px',
    marginTop: '8px'
  },
  continueShop: {
    display: 'block',
    textAlign: 'center',
    fontSize: '0.9rem',
    fontWeight: 600,
    color: 'var(--text-muted)',
    marginTop: '16px',
  },
  emptyCart: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '80px 20px',
    maxWidth: '500px',
    margin: '100px auto',
    background: 'var(--bg-tertiary)'
  }
};

export default Cart;
