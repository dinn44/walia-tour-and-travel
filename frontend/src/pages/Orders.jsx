import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../components/ProductCard';
import { ShieldCheck, Truck, ShoppingBag, Eye, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Orders = ({ currency }) => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      try {
        const res = await fetch('/api/orders/my-orders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
          if (data.orders.length > 0) {
            setSelectedOrder(data.orders[0]); // Default select first
          }
        }
      } catch (err) {
        console.warn('[Orders Page] Offline catalog fallback activated.');
        // Fallback simulated orders in case server is not running yet during first paint
        const mockOrders = [
          {
            id: "ord-sim-1",
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            total: 330.00,
            status: "Processing",
            paymentStatus: "paid",
            shippingAddress: { name: "Jane Doe", street: "100 Obsidian Way", city: "New York", country: "USA", zip: "10001" },
            items: [
              { product: { title: "Minimalist Chronograph Onyx", price: 185.00, brand: "DIN Signature", images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800"] }, quantity: 1 },
              { product: { title: "AeroPolar Sunglasses", price: 145.00, brand: "DIN Optics", images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800"] }, quantity: 1 }
            ]
          }
        ];
        setOrders(mockOrders);
        setSelectedOrder(mockOrders[0]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  if (!token) {
    return (
      <div style={styles.loginRequired} className="glass-panel animate-fade-in">
        <ShoppingBag size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
        <h2>Orders Verification Needed</h2>
        <p>Please establish connection to your credentials account to track transit timelines.</p>
        <Link to="/login" className="btn btn-primary" style={{ marginTop: '16px' }}>Sign In</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
      </div>
    );
  }

  // Stage details helper
  const getStatusIndex = (status) => {
    const stages = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    return stages.indexOf(status);
  };

  const stages = ['Pending', 'Processing', 'Shipped', 'Delivered'];
  const activeStageIdx = selectedOrder ? getStatusIndex(selectedOrder.status) : 0;

  return (
    <div style={styles.orders} className="animate-fade-in">
      <div style={styles.header}>
        <span className="badge badge-primary">Customer Center</span>
        <h1 style={styles.title}>Your Acquisitions & Shipments</h1>
      </div>

      {orders.length === 0 ? (
        <div className="glass-panel animate-fade-in" style={styles.emptyContainer}>
          <ShoppingBag size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
          <h3>No Orders Found</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '8px auto 20px auto' }}>
            You haven't cataloged any acquisitions yet. Test a purchase through our checkout portal!
          </p>
          <Link to="/shop" className="btn btn-primary">Visit Exhibition</Link>
        </div>
      ) : (
        <div style={styles.grid}>
          {/* Orders History List Column */}
          <div style={styles.historyCol}>
            <h3 style={styles.colHeading}>Purchase Index ({orders.length})</h3>
            <div style={styles.list}>
              {orders.map((ord) => {
                const oid = ord.id || ord._id;
                const isSelected = selectedOrder && (selectedOrder.id || selectedOrder._id) === oid;
                
                return (
                  <button 
                    key={oid} 
                    onClick={() => setSelectedOrder(ord)}
                    className="glass-panel"
                    style={{
                      ...styles.orderItemBtn,
                      borderLeft: isSelected ? '4px solid var(--accent)' : '1px solid var(--border-color)',
                      background: isSelected ? 'var(--bg-tertiary)' : 'rgba(0,0,0,0.01)'
                    }}
                  >
                    <div style={styles.itemHeader}>
                      <span style={styles.orderId}>Ref: {oid.slice(-8).toUpperCase()}</span>
                      <span style={styles.orderDate}>{new Date(ord.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div style={styles.itemDetails}>
                      <span style={styles.orderTotal}>{formatPrice(ord.total, currency)}</span>
                      <span 
                        style={{
                          ...styles.orderBadge,
                          background: ord.status === 'Delivered' ? 'rgba(16, 185, 129, 0.1)' : 'var(--accent-glow)',
                          color: ord.status === 'Delivered' ? 'var(--success)' : 'var(--accent)'
                        }}
                      >
                        {ord.status}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Order Stage Tracker Column */}
          {selectedOrder && (
            <div className="glass-panel" style={styles.trackerCol}>
              <div style={styles.trackerHeader}>
                <div>
                  <span className="badge badge-success">Active Parcel Tracker</span>
                  <h2 style={{ fontSize: '1.4rem', marginTop: '6px' }}>Invoice Code: {(selectedOrder.id || selectedOrder._id).toUpperCase()}</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    <Calendar size={12} />
                    Verified Checkout: {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <hr style={styles.divider} />

              {/* Graphical Stage Progress Line */}
              <div style={styles.timelineContainer}>
                <div style={styles.timelineProgressLine}>
                  <div 
                    style={{
                      ...styles.timelineActiveLine,
                      width: `${(activeStageIdx / (stages.length - 1)) * 100}%`
                    }}
                  ></div>
                </div>

                <div style={styles.timelineNodes}>
                  {stages.map((stage, idx) => {
                    const isPassed = idx <= activeStageIdx;
                    const isActive = idx === activeStageIdx;
                    
                    return (
                      <div key={idx} style={styles.timelineNode}>
                        <div 
                          style={{
                            ...styles.nodeDot,
                            background: isActive ? 'var(--accent)' : (isPassed ? 'var(--accent-hover)' : 'var(--bg-secondary)'),
                            borderColor: isPassed ? 'var(--accent)' : 'var(--border-color)',
                            boxShadow: isActive ? '0 0 12px var(--accent-glow)' : 'none'
                          }}
                        >
                          {isPassed && <span style={styles.nodeCheck}>✓</span>}
                        </div>
                        <span style={{
                          ...styles.nodeLabel,
                          fontWeight: isActive ? 700 : 500,
                          color: isActive ? 'var(--text-primary)' : 'var(--text-muted)'
                        }}>
                          {stage}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <hr style={styles.divider} />

              {/* Order Package Contents */}
              <div style={styles.packageDetails}>
                <h4 style={styles.sectionHeading}>Package Selections</h4>
                <div style={styles.itemsList}>
                  {selectedOrder.items.map((it, index) => (
                    <div key={index} style={styles.packageItem}>
                      <img 
                        src={it.product ? it.product.images[0] : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200"} 
                        alt="item" 
                        style={styles.packageItemImg}
                      />
                      <div style={styles.packageItemDetails}>
                        <p style={styles.packageItemTitle}>{it.product ? it.product.title : "Acquired Design"}</p>
                        <p style={styles.packageItemPrice}>
                          {it.quantity}x • {formatPrice(it.price, currency)}
                        </p>
                      </div>
                      <span style={styles.packageItemTotal}>
                        {formatPrice(it.price * it.quantity, currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <hr style={styles.divider} />

              {/* Recipient Address */}
              <div style={styles.addressSection}>
                <h4 style={styles.sectionHeading}>Delivery Destination</h4>
                <p style={styles.addressLine}><strong>Name:</strong> {selectedOrder.shippingAddress.name}</p>
                <p style={styles.addressLine}><strong>Street:</strong> {selectedOrder.shippingAddress.street}</p>
                <p style={styles.addressLine}><strong>City / ZIP:</strong> {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.zip}</p>
                <p style={styles.addressLine}><strong>Country:</strong> {selectedOrder.shippingAddress.country}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  orders: {
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
  historyCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  colHeading: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.2rem',
    fontWeight: 700
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  orderItemBtn: {
    width: '100%',
    padding: '20px',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    cursor: 'pointer',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-sm)',
    transition: 'var(--transition-smooth)'
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem'
  },
  orderId: {
    fontWeight: 700,
    color: 'var(--text-primary)'
  },
  orderDate: {
    color: 'var(--text-muted)'
  },
  itemDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '4px'
  },
  orderTotal: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: 'var(--text-primary)'
  },
  orderBadge: {
    fontSize: '0.7rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    padding: '4px 10px',
    borderRadius: 'var(--radius-sm)',
    letterSpacing: '0.05em'
  },
  trackerCol: {
    padding: '40px',
    background: 'var(--bg-tertiary)',
    boxShadow: 'var(--shadow-md)'
  },
  trackerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start'
  },
  divider: {
    border: 'none',
    borderBottom: '1px solid var(--border-color)',
    margin: '24px 0'
  },
  timelineContainer: {
    position: 'relative',
    margin: '32px 0 20px 0'
  },
  timelineProgressLine: {
    position: 'absolute',
    top: '16px',
    left: '8%',
    right: '8%',
    height: '4px',
    background: 'var(--bg-secondary)',
    borderRadius: '2px',
    zIndex: 1,
    transition: 'background-color 0.4s ease'
  },
  timelineActiveLine: {
    height: '100%',
    background: 'var(--accent)',
    borderRadius: '2px',
    transition: 'width 0.4s ease'
  },
  timelineNodes: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: 2
  },
  timelineNode: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    width: '80px'
  },
  nodeDot: {
    width: '36px',
    height: '36px',
    borderRadius: 'var(--radius-full)',
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'var(--transition-smooth)'
  },
  nodeCheck: {
    color: '#ffffff',
    fontSize: '0.85rem',
    fontWeight: 700
  },
  nodeLabel: {
    fontSize: '0.8rem',
    textAlign: 'center'
  },
  sectionHeading: {
    fontSize: '0.8rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--text-muted)',
    marginBottom: '16px'
  },
  packageDetails: {
    display: 'flex',
    flexDirection: 'column'
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  packageItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  packageItemImg: {
    width: '50px',
    height: '50px',
    borderRadius: 'var(--radius-sm)',
    objectFit: 'cover',
    border: '1px solid var(--border-color)',
    background: 'var(--bg-secondary)'
  },
  packageItemDetails: {
    flex: 1
  },
  packageItemTitle: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: 'var(--text-primary)'
  },
  packageItemPrice: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)'
  },
  packageItemTotal: {
    fontSize: '0.95rem',
    fontWeight: 700
  },
  addressSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  addressLine: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)'
  },
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '80px 20px',
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

export default Orders;
