import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../components/ProductCard';
import { 
  BarChart3, 
  ShoppingBag, 
  Users, 
  DollarSign, 
  ShieldAlert, 
  Trash2, 
  Edit3, 
  Plus, 
  Settings,
  X,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = ({ currency }) => {
  const { token, user } = useAuth();
  
  // Dashboard Metrics states
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Layout tabs
  const [activeTab, setActiveTab] = useState('overview');

  // Product CRUD states
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [prodForm, setProdForm] = useState({
    title: '', description: '', price: '', category: '', brand: '', stock: '', images: '', features: ''
  });
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalError, setModalError] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        // Fetch stats
        const statsRes = await fetch('/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const statsData = await statsRes.json();
        
        // Fetch orders
        const ordersRes = await fetch('/api/admin/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const ordersData = await ordersRes.json();

        // Fetch products
        const prodsRes = await fetch('/api/products');
        const prodsData = await prodsRes.json();

        if (statsData.success && ordersData.success && prodsData.success) {
          setStats(statsData.stats);
          setOrders(ordersData.orders);
          setProductsList(prodsData.products);
        } else {
          setError(statsData.message || ordersData.message || 'Verification failed');
        }
      } catch (err) {
        console.warn('[Admin Dashboard] Server offline fallback activated.');
        // Fallback offline mock dashboards
        const mockStats = {
          totalSales: 1038.00,
          ordersCount: 3,
          customersCount: 1,
          productsCount: 6,
          lowStockCount: 0,
          categoryBreakdown: { "Timepieces": 24, "Leather Goods": 12, "Eyewear": 35 },
          salesTrends: [
            { date: "May 25", sales: 185.00 },
            { date: "May 26", sales: 0.00 },
            { date: "May 27", sales: 320.00 },
            { date: "May 28", sales: 145.00 },
            { date: "May 29", sales: 210.00 },
            { date: "May 30", sales: 178.00 },
            { date: "May 31", sales: 0.00 }
          ]
        };
        const mockProducts = [
          { _id: "prod-1", title: "Minimalist Chronograph Onyx", price: 185.00, category: "Timepieces", brand: "DIN Signature", stock: 24, ratings: 4.8 },
          { _id: "prod-2", title: "Lux Suede Courier Bag", price: 320.00, category: "Leather Goods", brand: "DIN Atelier", stock: 12, ratings: 4.9 },
          { _id: "prod-3", title: "AeroPolar Sunglasses", price: 145.00, category: "Eyewear", brand: "DIN Optics", stock: 35, ratings: 4.6 }
        ];
        const mockOrders = [
          { _id: "ord-1", id: "ord-1", user: { name: "Jane Doe", email: "customer@din.com" }, total: 330.00, status: "Processing", paymentStatus: "paid", createdAt: new Date() }
        ];

        setStats(mockStats);
        setProductsList(mockProducts);
        setOrders(mockOrders);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [token]);

  // Order status update logic
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => (o._id || o.id) === orderId ? { ...o, status: newStatus } : o));
      }
    } catch (e) {
      // Local fallback simulator
      setOrders(prev => prev.map(o => (o._id || o.id) === orderId ? { ...o, status: newStatus } : o));
    }
  };

  // Delete product logic
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Verify: Delete this product from catalog?")) return;
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setProductsList(prev => prev.filter(p => (p._id || p.id) !== productId));
      }
    } catch (e) {
      // Local fallback simulator
      setProductsList(prev => prev.filter(p => (p._id || p.id) !== productId));
    }
  };

  // Product Create/Update Form handles
  const openModal = (prod = null) => {
    if (prod) {
      setEditingProduct(prod);
      setProdForm({
        title: prod.title,
        description: prod.description || '',
        price: prod.price,
        category: prod.category,
        brand: prod.brand,
        stock: prod.stock,
        images: prod.images ? prod.images.join(', ') : '',
        features: prod.features ? prod.features.join(', ') : ''
      });
    } else {
      setEditingProduct(null);
      setProdForm({ title: '', description: '', price: '', category: '', brand: '', stock: '', images: '', features: '' });
    }
    setModalError(null);
    setShowProductModal(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setModalSubmitting(true);
    setModalError(null);

    const payload = {
      ...prodForm,
      price: parseFloat(prodForm.price),
      stock: parseInt(prodForm.stock),
      images: prodForm.images ? prodForm.images.split(',').map(img => img.trim()) : [],
      features: prodForm.features ? prodForm.features.split(',').map(f => f.trim()) : []
    };

    try {
      let url = '/api/admin/products';
      let method = 'POST';

      if (editingProduct) {
        url += `/${editingProduct._id || editingProduct.id}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        if (editingProduct) {
          setProductsList(prev => prev.map(p => (p._id || p.id) === (editingProduct._id || editingProduct.id) ? data.product : p));
        } else {
          setProductsList(prev => [data.product, ...prev]);
        }
        setShowProductModal(false);
      } else {
        setModalError(data.message);
      }
    } catch (err) {
      // Offline local simulation CRUD support
      const simulatedProd = {
        _id: editingProduct ? editingProduct._id : `prod-sim-${Date.now()}`,
        id: editingProduct ? editingProduct.id : `prod-sim-${Date.now()}`,
        title: prodForm.title,
        price: parseFloat(prodForm.price),
        category: prodForm.category,
        brand: prodForm.brand,
        stock: parseInt(prodForm.stock),
        ratings: editingProduct ? editingProduct.ratings : 5.0,
        images: prodForm.images ? prodForm.images.split(',').map(img => img.trim()) : ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800"]
      };

      if (editingProduct) {
        setProductsList(prev => prev.map(p => (p._id || p.id) === (editingProduct._id || editingProduct.id) ? simulatedProd : p));
      } else {
        setProductsList(prev => [simulatedProd, ...prev]);
      }
      setShowProductModal(false);
    } finally {
      setModalSubmitting(false);
    }
  };

  if (!token || (user && user.role !== 'admin')) {
    return (
      <div style={styles.errorContainer} className="glass-panel animate-fade-in">
        <ShieldAlert size={48} style={{ color: 'var(--error)', marginBottom: '16px' }} />
        <h2>Access Restricted</h2>
        <p>Forbidden: Access restricted to DIN Administrators only.</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '16px' }}>Back to Home Gallery</Link>
      </div>
    );
  }

  if (loading || !stats) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
      </div>
    );
  }

  return (
    <div style={styles.admin} className="animate-fade-in">
      <div style={styles.header}>
        <span className="badge badge-primary">Management Console</span>
        <h1 style={styles.title}>Refined Admin Panel</h1>
      </div>

      {/* Tabs selectors */}
      <div style={styles.tabsRow}>
        <div style={styles.tabsHeaders}>
          <button 
            onClick={() => setActiveTab('overview')} 
            style={{
              ...styles.tabHeaderBtn,
              borderBottomColor: activeTab === 'overview' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'overview' ? 'var(--text-primary)' : 'var(--text-muted)'
            }}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('products')} 
            style={{
              ...styles.tabHeaderBtn,
              borderBottomColor: activeTab === 'products' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'products' ? 'var(--text-primary)' : 'var(--text-muted)'
            }}
          >
            Catalog CRUD
          </button>
          <button 
            onClick={() => setActiveTab('orders')} 
            style={{
              ...styles.tabHeaderBtn,
              borderBottomColor: activeTab === 'orders' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'orders' ? 'var(--text-primary)' : 'var(--text-muted)'
            }}
          >
            Orders Portal
          </button>
        </div>

        {activeTab === 'products' && (
          <button onClick={() => openModal()} className="btn btn-primary" style={styles.addBtn}>
            <Plus size={16} />
            Create Product
          </button>
        )}
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div style={styles.tabContent} className="animate-fade-in-up">
          {/* Dashboard statistics blocks */}
          <div style={styles.metricsGrid}>
            <div className="glass-panel" style={styles.metricCard}>
              <DollarSign size={22} style={styles.metricIcon} />
              <div>
                <p style={styles.metricLabel}>Total Sales Revenue</p>
                <h3>{formatPrice(stats.totalSales, currency)}</h3>
              </div>
            </div>
            <div className="glass-panel" style={styles.metricCard}>
              <ShoppingBag size={22} style={styles.metricIcon} />
              <div>
                <p style={styles.metricLabel}>Orders Processed</p>
                <h3>{stats.ordersCount}</h3>
              </div>
            </div>
            <div className="glass-panel" style={styles.metricCard}>
              <Users size={22} style={styles.metricIcon} />
              <div>
                <p style={styles.metricLabel}>Customers Base</p>
                <h3>{stats.customersCount}</h3>
              </div>
            </div>
            <div className="glass-panel" style={styles.metricCard}>
              <BarChart3 size={22} style={styles.metricIcon} />
              <div>
                <p style={styles.metricLabel}>Refined Catalog</p>
                <h3>{stats.productsCount} Items</h3>
              </div>
            </div>
          </div>

          <div style={styles.analyticsLayoutGrid}>
            {/* Sales Trends Chart representation */}
            <div className="glass-panel" style={styles.chartCard}>
              <h3 style={styles.sectionHeading}>Weekly Revenues Matrix</h3>
              <div style={styles.salesTrendBox}>
                {stats.salesTrends.map((trend, index) => (
                  <div key={index} style={styles.trendCol}>
                    <div 
                      style={{
                        ...styles.trendBar,
                        height: `${Math.max(10, Math.min(100, (trend.sales / (stats.totalSales || 500)) * 100))}%`
                      }}
                      title={formatPrice(trend.sales, currency)}
                    ></div>
                    <span style={styles.trendDate}>{trend.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Inventory Alerts details */}
            <div className="glass-panel" style={styles.infoSummaryCard}>
              <h3 style={styles.sectionHeading}>Inventory Status Timeline</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px' }}>
                <div style={styles.statusCheckLine}>
                  <span style={styles.statusLedActive}>●</span>
                  <div>
                    <p style={styles.statusCheckLabel}>Low Inventory Warning</p>
                    <p style={styles.statusCheckDesc}>Items showing less than 5 stock entries: <strong>{stats.lowStockCount}</strong></p>
                  </div>
                </div>

                <div style={styles.statusCheckLine}>
                  <span style={styles.statusLedSuccess}>●</span>
                  <div>
                    <p style={styles.statusCheckLabel}>Atelier Category Spread</p>
                    <p style={styles.statusCheckDesc}>
                      {Object.entries(stats.categoryBreakdown).map(([cat, count]) => `${cat}: ${count}`).join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Catalog CRUD */}
      {activeTab === 'products' && (
        <div className="admin-table-container animate-fade-in-up">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Item Detail</th>
                <th>Category</th>
                <th>Price Unit</th>
                <th>Stock Level</th>
                <th>Refined Rating</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {productsList.map(prod => {
                const pid = prod._id || prod.id;
                return (
                  <tr key={pid}>
                    <td style={{ fontWeight: 600 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img 
                          src={prod.images ? prod.images[0] : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=100"} 
                          alt="preview" 
                          style={styles.tableImg}
                        />
                        <div>
                          <p style={{ margin: 0 }}>{prod.title}</p>
                          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{prod.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td>{prod.category}</td>
                    <td style={{ fontWeight: 700 }}>{formatPrice(prod.price, currency)}</td>
                    <td style={{ fontWeight: 700, color: prod.stock <= 5 ? 'var(--warning)' : 'inherit' }}>
                      {prod.stock} Units
                    </td>
                    <td>★ {prod.ratings || '5.0'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button onClick={() => openModal(prod)} style={styles.tableEditBtn}>
                          <Edit3 size={14} />
                        </button>
                        <button onClick={() => handleDeleteProduct(pid)} style={styles.tableDeleteBtn}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Orders Portal */}
      {activeTab === 'orders' && (
        <div className="admin-table-container animate-fade-in-up">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order Ref</th>
                <th>Customer</th>
                <th>Date Checkout</th>
                <th>Grand Total</th>
                <th>Timeline Status</th>
                <th style={{ textAlign: 'right' }}>Shift Stage</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(ord => {
                const oid = ord._id || ord.id;
                return (
                  <tr key={oid}>
                    <td style={{ fontWeight: 700 }}>{oid.slice(-8).toUpperCase()}</td>
                    <td>
                      <p style={{ margin: 0, fontWeight: 600 }}>{ord.user ? ord.user.name : "Jane Doe"}</p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ord.user ? ord.user.email : "guest@din.com"}</p>
                    </td>
                    <td>{new Date(ord.createdAt).toLocaleDateString()}</td>
                    <td style={{ fontWeight: 700 }}>{formatPrice(ord.total, currency)}</td>
                    <td>
                      <span 
                        style={{
                          ...styles.orderBadge,
                          background: ord.status === 'Delivered' ? 'rgba(16, 185, 129, 0.1)' : 'var(--accent-glow)',
                          color: ord.status === 'Delivered' ? 'var(--success)' : 'var(--accent)'
                        }}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <select 
                        value={ord.status} 
                        onChange={(e) => handleUpdateStatus(oid, e.target.value)}
                        style={styles.tableSelect}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Dynamic Products modal for CREATE and EDIT */}
      {showProductModal && (
        <div style={styles.modalBackdrop}>
          <div className="glass-panel animate-fade-in-up" style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <h3 style={{ fontSize: '1.25rem' }}>{editingProduct ? 'Update Product specifications' : 'Create New Collection Product'}</h3>
              <button onClick={() => setShowProductModal(false)} style={styles.modalClose}>
                <X size={18} />
              </button>
            </div>

            {modalError && <div className="badge badge-danger" style={{ marginBottom: '16px', width: '100%', justifyContent: 'center' }}>{modalError}</div>}

            <form onSubmit={handleModalSubmit} style={styles.modalForm}>
              <div style={styles.modalFormGrid}>
                <div className="form-group">
                  <label>Product Title</label>
                  <input 
                    type="text" 
                    value={prodForm.title} 
                    onChange={(e) => setProdForm({ ...prodForm, title: e.target.value })}
                    className="form-control"
                    placeholder="E.g. Minimalist Watch"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Brand Design Label</label>
                  <input 
                    type="text" 
                    value={prodForm.brand} 
                    onChange={(e) => setProdForm({ ...prodForm, brand: e.target.value })}
                    className="form-control"
                    placeholder="DIN Signature"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Price Unit (USD)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={prodForm.price} 
                    onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })}
                    className="form-control"
                    placeholder="185.00"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <input 
                    type="text" 
                    value={prodForm.category} 
                    onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                    className="form-control"
                    placeholder="Timepieces"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Stock Level</label>
                  <input 
                    type="number" 
                    value={prodForm.stock} 
                    onChange={(e) => setProdForm({ ...prodForm, stock: e.target.value })}
                    className="form-control"
                    placeholder="24"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Product Thumbnails (comma separated URLs)</label>
                  <input 
                    type="text" 
                    value={prodForm.images} 
                    onChange={(e) => setProdForm({ ...prodForm, images: e.target.value })}
                    className="form-control"
                    placeholder="http://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Product Description</label>
                <textarea 
                  value={prodForm.description} 
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  className="form-control"
                  rows="3"
                  placeholder="Provide luxury spec text..."
                  style={{ resize: 'none' }}
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label>Specifications Bullets (comma separated)</label>
                <input 
                  type="text" 
                  value={prodForm.features} 
                  onChange={(e) => setProdForm({ ...prodForm, features: e.target.value })}
                  className="form-control"
                  placeholder="Sapphire Glass, Matte Finish"
                />
              </div>

              <div style={styles.modalActions}>
                <button type="button" onClick={() => setShowProductModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={modalSubmitting} className="btn btn-primary">
                  {modalSubmitting ? 'Verifying...' : (editingProduct ? 'Save Changes' : 'Generate Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  admin: {
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
  tabsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--border-color)',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '12px'
  },
  tabsHeaders: {
    display: 'flex',
    gap: '24px'
  },
  tabHeaderBtn: {
    padding: '12px 4px',
    fontSize: '1rem',
    fontWeight: 600,
    borderBottom: '2px solid transparent',
    transition: 'var(--transition-smooth)'
  },
  addBtn: {
    padding: '8px 16px',
    fontSize: '0.85rem'
  },
  tabContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '40px'
  },
  metricsGrid: {
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
  metricCard: {
    padding: '24px',
    background: 'var(--bg-tertiary)',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: 'var(--shadow-sm)'
  },
  metricIcon: {
    color: 'var(--accent)'
  },
  metricLabel: {
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--text-muted)',
    marginBottom: '4px'
  },
  analyticsLayoutGrid: {
    display: 'grid',
    gridTemplateColumns: '1.6fr 1fr',
    gap: '32px',
    '@media (max-width: 992px)': {
      gridTemplateColumns: '1fr',
    }
  },
  chartCard: {
    padding: '30px',
    background: 'var(--bg-tertiary)',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  sectionHeading: {
    fontSize: '0.85rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--text-muted)',
  },
  salesTrendBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'end',
    height: '240px',
    paddingTop: '20px',
    borderBottom: '1px solid var(--border-color)'
  },
  trendCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    width: '10%'
  },
  trendBar: {
    width: '100%',
    borderRadius: '4px 4px 0 0',
    background: 'linear-gradient(to top, var(--accent) 0%, var(--accent-hover) 100%)',
    transition: 'var(--transition-spring)'
  },
  trendDate: {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: 'var(--text-muted)'
  },
  infoSummaryCard: {
    padding: '30px',
    background: 'var(--bg-tertiary)',
    boxShadow: 'var(--shadow-sm)'
  },
  statusCheckLine: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start'
  },
  statusLedActive: {
    color: 'var(--warning)',
    animation: 'pulseSlow 1.5s infinite linear'
  },
  statusLedSuccess: {
    color: 'var(--success)'
  },
  statusCheckLabel: {
    fontSize: '0.9rem',
    fontWeight: 700
  },
  statusCheckDesc: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
    marginTop: '2px'
  },
  tableImg: {
    width: '36px',
    height: '36px',
    borderRadius: 'var(--radius-sm)',
    objectFit: 'cover',
    border: '1px solid var(--border-color)'
  },
  tableEditBtn: {
    width: '28px',
    height: '28px',
    borderRadius: '4px',
    background: 'var(--bg-secondary)',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'var(--transition-smooth)'
  },
  tableDeleteBtn: {
    width: '28px',
    height: '28px',
    borderRadius: '4px',
    background: 'rgba(239, 68, 68, 0.1)',
    color: 'var(--error)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'var(--transition-smooth)'
  },
  orderBadge: {
    fontSize: '0.65rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    padding: '4px 8px',
    borderRadius: '4px',
    letterSpacing: '0.05em'
  },
  tableSelect: {
    padding: '4px 8px',
    borderRadius: '4px',
    background: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    fontSize: '0.8rem',
    fontWeight: 600,
    border: '1px solid var(--border-color)',
    cursor: 'pointer'
  },
  modalBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    backdropFilter: 'blur(4px)',
    zIndex: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px'
  },
  modalCard: {
    maxWidth: '680px',
    width: '100%',
    padding: '30px',
    background: 'var(--bg-tertiary)',
    boxShadow: 'var(--shadow-lg)'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  modalClose: {
    color: 'var(--text-muted)'
  },
  modalForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  modalFormGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    '@media (max-width: 576px)': {
      gridTemplateColumns: '1fr'
    }
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '16px'
  },
  errorContainer: {
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

export default AdminDashboard;
