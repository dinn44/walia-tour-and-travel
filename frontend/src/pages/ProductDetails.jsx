import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ReviewStars from '../components/ReviewStars';
import ProductCard, { formatPrice } from '../components/ProductCard';
import { 
  Heart, 
  ShoppingCart, 
  ChevronRight, 
  Shield, 
  Truck, 
  RotateCcw,
  Sparkles,
  MessageSquarePlus
} from 'lucide-react';

const ProductDetails = ({ currency }) => {
  const { id } = useParams();
  const { user, toggleWishlist, addRecentlyViewed, token } = useAuth();
  const { addToCart } = useCart();

  // Data states
  const [product, setProduct] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Layout states
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  // Review states
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(null);
  const [reviewError, setReviewError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const uid = user ? (user.id || user._id) : '';
        const res = await fetch(`/api/products/${id}?userId=${uid}`);
        const data = await res.json();
        
        if (data.success) {
          setProduct(data.product);
          setActiveImage(0);
          setQuantity(1);
          
          // Log recently viewed inside AuthContext
          addRecentlyViewed(data.product);

          // Fetch recommendations
          const recRes = await fetch(`/api/products/recommendations/ai?userId=${uid}`);
          const recData = await recRes.json();
          if (recData.success) {
            setRecommended(recData.recommendations.filter(p => (p._id || p.id) !== id).slice(0, 4));
          }
        } else {
          setError(data.message);
        }
      } catch (err) {
        console.warn('[Product Details] Server connection failed, loading offline mocks.');
        // Fallback mock item
        const mockCatalog = [
          { _id: "prod-1", title: "Minimalist Chronograph Onyx", price: 185.00, description: "A precision-crafted timepiece featuring an all-black obsidian matte finish, sapphire crystal glass, and Japanese quartz movement. Water-resistant up to 5ATM.", category: "Timepieces", brand: "DIN Signature", images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=800"], stock: 24, ratings: 4.8, reviews: [{ user: "Alexander V.", rating: 5, comment: "Absolutely stunning watch. The matte black finish is gorgeous.", createdAt: new Date() }], features: ["Matte Finish", "Sapphire Glass", "Japanese Quartz", "5ATM Water Resistant"] },
          { _id: "prod-2", title: "Lux Suede Courier Bag", price: 320.00, description: "Handcrafted from top-grade Italian suede and reinforced with full-grain vachetta leather straps. Perfectly fits a 15-inch laptop.", category: "Leather Goods", brand: "DIN Atelier", images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800"], stock: 12, ratings: 4.9, reviews: [], features: ["Italian Suede", "Laptop Slot", "Solid Brass Hardware"] },
          { _id: "prod-3", title: "AeroPolar Sunglasses", price: 145.00, description: "Ultralight titanium aviators designed with polarized premium mineral lenses.", category: "Eyewear", brand: "DIN Optics", images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800"], stock: 35, ratings: 4.6, reviews: [], features: ["Titanium Frame", "Polarized", "UV400"] }
        ];
        
        const matched = mockCatalog.find(p => p._id === id);
        if (matched) {
          setProduct(matched);
          addRecentlyViewed(matched);
          setRecommended(mockCatalog.filter(p => p._id !== id));
        } else {
          setError('Product not found');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id, user]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setReviewError('Please login to submit a review.');
      return;
    }
    
    setSubmittingReview(true);
    setReviewError(null);
    setReviewSuccess(null);

    try {
      const res = await fetch(`/api/products/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment })
      });
      const data = await res.json();
      if (data.success) {
        setReviewSuccess('Thank you! Your feedback has been verified.');
        setReviewComment('');
        
        // Re-hydrate local product reviews
        setProduct(prev => ({
          ...prev,
          reviews: data.reviews,
          ratings: data.ratings
        }));
      } else {
        setReviewError(data.message);
      }
    } catch (err) {
      // Offline local review push simulation
      if (product && user) {
        const dummyReview = {
          user: user.name,
          rating: reviewRating,
          comment: reviewComment,
          createdAt: new Date()
        };
        const updatedReviews = [...product.reviews, dummyReview];
        const avg = updatedReviews.reduce((s, r) => s + r.rating, 0) / updatedReviews.length;
        
        setProduct(prev => ({
          ...prev,
          reviews: updatedReviews,
          ratings: parseFloat(avg.toFixed(1))
        }));
        
        setReviewSuccess('Review simulated successfully offline.');
        setReviewComment('');
      } else {
        setReviewError('Review post failed.');
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={styles.errorContainer} className="glass-panel">
        <h3>Product Retrieval Failed</h3>
        <p>{error || 'An unexpected item match error occurred.'}</p>
        <Link to="/shop" className="btn btn-primary" style={{ marginTop: '16px' }}>Back to Exhibition Catalog</Link>
      </div>
    );
  }

  const isWishlisted = user && user.wishlist && user.wishlist.some(
    pid => (pid._id || pid.id || pid) === (product._id || product.id)
  );

  return (
    <div style={styles.details} className="animate-fade-in">
      {/* Breadcrumb row */}
      <div style={styles.breadcrumb}>
        <Link to="/" style={styles.breadLink}>Home</Link>
        <ChevronRight size={14} style={styles.breadDivider} />
        <Link to="/shop" style={styles.breadLink}>Shop</Link>
        <ChevronRight size={14} style={styles.breadDivider} />
        <span style={styles.breadCurrent}>{product.title}</span>
      </div>

      {/* Main product display card grid */}
      <div style={styles.productGrid}>
        {/* Gallery */}
        <div style={styles.gallery}>
          <div style={styles.mainImageContainer}>
            <img 
              src={product.images && product.images[activeImage]} 
              alt={product.title} 
              style={styles.mainImage}
            />
          </div>

          {/* Thumbnails row */}
          {product.images && product.images.length > 1 && (
            <div style={styles.thumbnails}>
              {product.images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(idx)}
                  style={{
                    ...styles.thumbnailBtn,
                    borderColor: activeImage === idx ? 'var(--accent)' : 'var(--border-color)',
                    transform: activeImage === idx ? 'scale(1.05)' : 'scale(1)'
                  }}
                >
                  <img src={img} alt="thumbnail" style={styles.thumbnailImg} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Purchase Options Info Panel */}
        <div style={styles.infoCol}>
          <div>
            <p style={styles.brandTag}>{product.brand}</p>
            <h1 style={styles.title}>{product.title}</h1>
            
            {/* Rating summary */}
            <div style={styles.ratingsRow}>
              <ReviewStars rating={product.ratings || 5.0} size={14} />
              <span style={styles.ratingVal}>{product.ratings || '5.0'}</span>
              <span style={styles.revCount}>({product.reviews ? product.reviews.length : 0} Reviews)</span>
            </div>
          </div>

          <p style={styles.price}>{formatPrice(product.price, currency)}</p>

          <hr style={styles.divider} />

          {/* Core short details */}
          <p style={styles.descriptionText}>{product.description}</p>

          {/* Features list bullet points */}
          {product.features && product.features.length > 0 && (
            <div style={styles.features}>
              <h4 style={styles.sectionHeading}>Specifications</h4>
              <ul style={styles.featureList}>
                {product.features.map((feat, i) => (
                  <li key={i} style={styles.featureItem}>
                    <Sparkles size={12} style={{ color: 'var(--accent)' }} />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Inventory Banners */}
          <div style={styles.stockRow}>
            {product.stock > 0 ? (
              <span style={{ ...styles.stockStatus, color: product.stock <= 5 ? 'var(--warning)' : 'var(--success)' }}>
                ● {product.stock <= 5 ? `Urgent: Only ${product.stock} Units Remaining` : 'In Stock & Ready for Transit'}
              </span>
            ) : (
              <span style={{ ...styles.stockStatus, color: 'var(--error)' }}>
                ● Sold Out / Under Replenishment
              </span>
            )}
          </div>

          {/* Quantities & Add to cart row */}
          {product.stock > 0 && (
            <div style={styles.checkoutActions}>
              <div style={styles.qtyContainer}>
                <button 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))} 
                  style={styles.qtyBtn}
                >-</button>
                <span style={styles.qtyVal}>{quantity}</span>
                <button 
                  onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))} 
                  style={styles.qtyBtn}
                >+</button>
              </div>

              <button 
                onClick={() => addToCart(product, quantity)}
                className="btn btn-primary" 
                style={styles.cartSubmit}
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>

              <button 
                onClick={() => toggleWishlist(product._id || product.id)}
                className="btn btn-secondary" 
                style={{
                  ...styles.wishlistToggle,
                  color: isWishlisted ? '#ef4444' : 'var(--text-primary)',
                  borderColor: isWishlisted ? '#ef4444' : 'var(--border-color)',
                  background: isWishlisted ? 'rgba(239, 68, 68, 0.05)' : 'none'
                }}
              >
                <Heart size={18} fill={isWishlisted ? "#ef4444" : "none"} />
              </button>
            </div>
          )}

          <hr style={styles.divider} />

          {/* Dispatch benefits badges */}
          <div style={styles.benefits}>
            <div style={styles.benefitItem}>
              <Truck size={18} style={styles.benefitIcon} />
              <div>
                <p style={styles.benefitTitle}>Priority Dispatch</p>
                <p style={styles.benefitText}>Free express worldwide courier transit (2-4 business days).</p>
              </div>
            </div>
            <div style={styles.benefitItem}>
              <RotateCcw size={18} style={styles.benefitIcon} />
              <div>
                <p style={styles.benefitTitle}>Complimentary Returns</p>
                <p style={styles.benefitText}>Effortless return collections scheduled at your residence within 30 days.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs panels for Details / Reviews */}
      <section style={styles.tabSection}>
        <div style={styles.tabsHeaders}>
          <button 
            onClick={() => setActiveTab('description')} 
            style={{
              ...styles.tabHeaderBtn,
              borderColor: activeTab === 'description' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'description' ? 'var(--text-primary)' : 'var(--text-muted)'
            }}
          >
            Product Narrative
          </button>
          <button 
            onClick={() => setActiveTab('reviews')} 
            style={{
              ...styles.tabHeaderBtn,
              borderColor: activeTab === 'reviews' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'reviews' ? 'var(--text-primary)' : 'var(--text-muted)'
            }}
          >
            Customer Reviews ({product.reviews ? product.reviews.length : 0})
          </button>
        </div>

        <div className="glass-panel" style={styles.tabsContent}>
          {activeTab === 'description' ? (
            <div style={styles.tabDetails}>
              <h3 style={{ marginBottom: '12px' }}>Architectural Specs</h3>
              <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                This masterpiece represents the core DNA of the DIN label: uncompromising performance, hyper-minimalist details, and structural materials built to endure. Each specimen undergoes multiple hours of rigorous hand calibration and aesthetic tolerance checking before serial number engraving.
              </p>
              <div style={styles.specsTable}>
                <div style={styles.specsRow}>
                  <span style={styles.specsKey}>Label / Brand</span>
                  <span style={styles.specsVal}>{product.brand}</span>
                </div>
                <div style={styles.specsRow}>
                  <span style={styles.specsKey}>Collection Category</span>
                  <span style={styles.specsVal}>{product.category}</span>
                </div>
                <div style={styles.specsRow}>
                  <span style={styles.specsKey}>Aesthetic Weight</span>
                  <span style={styles.specsVal}>Ultra-refined / Light</span>
                </div>
                <div style={styles.specsRow}>
                  <span style={styles.specsKey}>Transit Package</span>
                  <span style={styles.specsVal}>Signature DIN Giftbox Included</span>
                </div>
              </div>
            </div>
          ) : (
            <div style={styles.tabReviews}>
              {/* Reviews List */}
              <div style={styles.reviewsList}>
                {(!product.reviews || product.reviews.length === 0) ? (
                  <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No customer feedback records yet. Be the first to catalog your thoughts.</p>
                ) : (
                  product.reviews.map((rev, idx) => (
                    <div key={idx} style={styles.reviewCard}>
                      <div style={styles.revHeader}>
                        <div>
                          <p style={styles.revUser}>{rev.user}</p>
                          <ReviewStars rating={rev.rating} size={11} />
                        </div>
                        <span style={styles.revDate}>{new Date(rev.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p style={styles.revComment}>{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Submit a review form */}
              <div style={styles.submitReviewCol}>
                <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageSquarePlus size={18} style={{ color: 'var(--accent)' }} />
                  Submit Feedback
                </h3>

                {token ? (
                  <form onSubmit={handleReviewSubmit} style={styles.reviewForm}>
                    {reviewSuccess && <div className="badge badge-success" style={{ marginBottom: '12px', width: '100%', justifyContent: 'center' }}>{reviewSuccess}</div>}
                    {reviewError && <div className="badge badge-danger" style={{ marginBottom: '12px', width: '100%', justifyContent: 'center' }}>{reviewError}</div>}

                    <div style={styles.ratingFormInput}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Score Card:</span>
                      <ReviewStars rating={reviewRating} size={18} interactive={true} onRatingChange={setReviewRating} />
                    </div>

                    <textarea 
                      placeholder="Share your experience with this design..."
                      rows="4"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      style={styles.reviewTextArea}
                      required
                    ></textarea>

                    <button 
                      type="submit" 
                      disabled={submittingReview} 
                      className="btn btn-primary"
                      style={{ alignSelf: 'flex-start', marginTop: '12px' }}
                    >
                      {submittingReview ? 'Verifying...' : 'Submit Verified Review'}
                    </button>
                  </form>
                ) : (
                  <div style={styles.loginRequiredBox}>
                    <p style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '12px' }}>Please login to provide rating metrics and review text.</p>
                    <Link to="/login" className="btn btn-secondary btn-sm">Sign In to Account</Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* AI Recommendations Slider Carousel */}
      {recommended.length > 0 && (
        <section style={styles.recommends}>
          <div style={{ marginBottom: '32px' }}>
            <span className="badge badge-primary">Dynamic Matcher</span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '6px' }}>AI-Powered Recommendations</h2>
          </div>
          
          <div className="products-grid">
            {recommended.map(prod => (
              <ProductCard key={prod._id || prod.id} product={prod} currency={currency} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

const styles = {
  details: {
    maxWidth: '1280px',
    margin: '40px auto',
    padding: '0 24px',
    paddingBottom: '80px'
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '32px',
    fontSize: '0.85rem'
  },
  breadLink: {
    color: 'var(--text-muted)',
    fontWeight: 500
  },
  breadDivider: {
    color: 'var(--text-muted)'
  },
  breadCurrent: {
    color: 'var(--text-primary)',
    fontWeight: 600
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 1fr',
    gap: '60px',
    alignItems: 'start',
    '@media (max-width: 992px)': {
      gridTemplateColumns: '1fr',
      gap: '40px'
    }
  },
  gallery: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  mainImageContainer: {
    position: 'relative',
    paddingTop: '100%',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)'
  },
  mainImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  thumbnails: {
    display: 'flex',
    gap: '12px'
  },
  thumbnailBtn: {
    width: '70px',
    height: '70px',
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
    border: '2px solid transparent',
    background: 'var(--bg-secondary)',
    padding: 0,
    transition: 'var(--transition-spring)'
  },
  thumbnailImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  infoCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  brandTag: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: 'var(--accent)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: '6px'
  },
  title: {
    fontFamily: 'var(--font-heading)',
    fontSize: '2.25rem',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    lineHeight: '1.2'
  },
  ratingsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '8px'
  },
  ratingVal: {
    fontSize: '0.85rem',
    fontWeight: 700
  },
  revCount: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)'
  },
  price: {
    fontSize: '2rem',
    fontWeight: 700,
    color: 'var(--text-primary)'
  },
  divider: {
    border: 'none',
    borderBottom: '1px solid var(--border-color)',
    margin: 0
  },
  descriptionText: {
    fontSize: '1rem',
    lineHeight: '1.7',
    color: 'var(--text-secondary)'
  },
  sectionHeading: {
    fontSize: '0.85rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--text-muted)',
    marginBottom: '10px'
  },
  featureList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  featureItem: {
    fontSize: '0.9rem',
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  stockRow: {
    marginTop: '4px'
  },
  stockStatus: {
    fontSize: '0.85rem',
    fontWeight: 700,
    letterSpacing: '0.01em'
  },
  checkoutActions: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  qtyContainer: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    background: 'var(--bg-secondary)',
    height: '46px',
    overflow: 'hidden'
  },
  qtyBtn: {
    width: '40px',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    fontWeight: 600,
    color: 'var(--text-secondary)'
  },
  qtyVal: {
    padding: '0 12px',
    fontWeight: 700,
    fontSize: '1rem',
    minWidth: '32px',
    textAlign: 'center'
  },
  cartSubmit: {
    flex: 1,
    height: '46px',
    minWidth: '160px'
  },
  wishlistToggle: {
    width: '46px',
    height: '46px',
    borderRadius: 'var(--radius-md)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0
  },
  benefits: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  benefitItem: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start'
  },
  benefitIcon: {
    color: 'var(--accent)',
    marginTop: '2px'
  },
  benefitTitle: {
    fontSize: '0.9rem',
    fontWeight: 700
  },
  benefitText: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)'
  },
  tabSection: {
    marginTop: '80px',
    marginBottom: '80px'
  },
  tabsHeaders: {
    display: 'flex',
    gap: '24px',
    borderBottom: '1px solid var(--border-color)',
    marginBottom: '16px'
  },
  tabHeaderBtn: {
    padding: '12px 4px',
    fontSize: '1rem',
    fontWeight: 600,
    borderBottom: '2px solid transparent',
    transition: 'var(--transition-smooth)'
  },
  tabsContent: {
    padding: '40px',
    background: 'var(--bg-tertiary)'
  },
  tabDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  specsTable: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '16px',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden'
  },
  specsRow: {
    display: 'flex',
    padding: '12px 16px',
    borderBottom: '1px solid var(--border-color)',
    fontSize: '0.9rem',
    '@media (max-width: 576px)': {
      flexDirection: 'column',
      gap: '4px'
    }
  },
  specsKey: {
    width: '200px',
    fontWeight: 700,
    color: 'var(--text-muted)'
  },
  specsVal: {
    color: 'var(--text-primary)',
    fontWeight: 500
  },
  tabReviews: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '48px',
    alignItems: 'start',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: '40px'
    }
  },
  reviewsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  reviewCard: {
    padding: '20px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-color)',
    background: 'var(--bg-secondary)'
  },
  revHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '10px'
  },
  revUser: {
    fontWeight: 700,
    fontSize: '0.95rem'
  },
  revDate: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)'
  },
  revComment: {
    fontSize: '0.9rem',
    lineHeight: '1.6',
    color: 'var(--text-secondary)'
  },
  submitReviewCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  reviewForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  ratingFormInput: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '6px'
  },
  reviewTextArea: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-color)',
    background: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    resize: 'none',
    transition: 'var(--transition-smooth)'
  },
  loginRequiredBox: {
    padding: '24px',
    borderRadius: 'var(--radius-md)',
    border: '1px dashed var(--border-color)',
    textAlign: 'center'
  },
  recommends: {
    marginTop: '60px'
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
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '80px 20px',
    background: 'var(--bg-tertiary)',
    maxWidth: '500px',
    margin: '100px auto'
  }
};

export default ProductDetails;
