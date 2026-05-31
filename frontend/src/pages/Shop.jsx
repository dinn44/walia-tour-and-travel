import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, ArrowUpDown, RefreshCw } from 'lucide-react';

const Shop = ({ currency }) => {
  const location = useLocation();

  // Search/Filter states
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(400);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState('featured');
  
  // Data states
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(['All']);
  const [brands, setBrands] = useState(['All']);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync category query from URL on load (e.g. from Home page link clicks)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const catParam = params.get('category');
    if (catParam) {
      setSelectedCategory(catParam);
    }
  }, [location.search]);

  // Load and apply search
  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        let url = `/api/products?`;
        if (selectedCategory && selectedCategory !== 'All') {
          url += `category=${selectedCategory}&`;
        }
        if (selectedBrand && selectedBrand !== 'All') {
          url += `brand=${selectedBrand}&`;
        }
        if (search) {
          url += `search=${encodeURIComponent(search)}&`;
        }
        if (minPrice) {
          url += `minPrice=${minPrice}&`;
        }
        if (maxPrice) {
          url += `maxPrice=${maxPrice}&`;
        }
        if (minRating) {
          url += `rating=${minRating}&`;
        }

        const res = await fetch(url);
        const data = await res.json();
        
        if (data.success) {
          // Dynamic sorting
          let sorted = [...data.products];
          if (sort === 'price-low') {
            sorted.sort((a, b) => a.price - b.price);
          } else if (sort === 'price-high') {
            sorted.sort((a, b) => b.price - a.price);
          } else if (sort === 'rating') {
            sorted.sort((a, b) => b.ratings - a.ratings);
          }
          
          setProducts(sorted);

          // Build unique lists dynamically
          const rawRes = await fetch('/api/products');
          const rawData = await rawRes.json();
          if (rawData.success) {
            const cats = new Set(rawData.products.map(p => p.category));
            const brs = new Set(rawData.products.map(p => p.brand));
            setCategories(['All', ...cats]);
            setBrands(['All', ...brs]);
          }
        }
      } catch (err) {
        console.warn('[Shop Catalog] Offline catalog fallback activated.', err);
        // Fallback offline filter
        const mockCatalog = [
          { _id: "prod-1", title: "Minimalist Chronograph Onyx", price: 185.00, category: "Timepieces", brand: "DIN Signature", images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800"], stock: 24, ratings: 4.8 },
          { _id: "prod-2", title: "Lux Suede Courier Bag", price: 320.00, category: "Leather Goods", brand: "DIN Atelier", images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800"], stock: 12, ratings: 4.9 },
          { _id: "prod-3", title: "AeroPolar Sunglasses", price: 145.00, category: "Eyewear", brand: "DIN Optics", images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800"], stock: 35, ratings: 4.6 },
          { _id: "prod-4", title: "Signature Cashmere Knit", price: 210.00, category: "Apparel", brand: "DIN Lounge", images: ["https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&q=80&w=800"], stock: 18, ratings: 4.7 },
          { _id: "prod-5", title: "Nomad Brass Desk Light", price: 260.00, category: "Living", brand: "DIN Casa", images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800"], stock: 8, ratings: 4.9 },
          { _id: "prod-6", title: "Atelier Leather Chelsea Boots", price: 295.00, category: "Footwear", brand: "DIN Atelier", images: ["https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&q=80&w=800"], stock: 15, ratings: 4.8 }
        ];

        let filtered = [...mockCatalog];
        if (search) {
          filtered = filtered.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
        }
        if (selectedCategory && selectedCategory !== 'All') {
          filtered = filtered.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
        }
        if (selectedBrand && selectedBrand !== 'All') {
          filtered = filtered.filter(p => p.brand.toLowerCase() === selectedBrand.toLowerCase());
        }
        filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);
        if (minRating) {
          filtered = filtered.filter(p => p.ratings >= minRating);
        }

        if (sort === 'price-low') {
          filtered.sort((a, b) => a.price - b.price);
        } else if (sort === 'price-high') {
          filtered.sort((a, b) => b.price - a.price);
        } else if (sort === 'rating') {
          filtered.sort((a, b) => b.ratings - a.ratings);
        }

        setProducts(filtered);
        setCategories(['All', 'Timepieces', 'Leather Goods', 'Eyewear', 'Apparel', 'Living', 'Footwear']);
        setBrands(['All', 'DIN Signature', 'DIN Atelier', 'DIN Optics', 'DIN Lounge', 'DIN Casa']);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchCatalog();
    }, 300); // 300ms debounce for search input

    return () => clearTimeout(delayDebounceFn);
  }, [search, selectedCategory, selectedBrand, minPrice, maxPrice, minRating, sort]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedBrand('All');
    setMinPrice(0);
    setMaxPrice(400);
    setMinRating(0);
    setSort('featured');
  };

  return (
    <div style={styles.shop} className="animate-fade-in">
      <div style={styles.header}>
        <span className="badge badge-primary">Curated Catalog</span>
        <h1 style={styles.title}>The Exhibition Shop</h1>
        <p style={styles.subtitle}>Filter, search, and discover architectural masterworks and refined accessories.</p>
      </div>

      <div style={styles.layoutGrid}>
        {/* Sidebar Filters Panel */}
        <aside className={`glass-panel ${showMobileFilters ? 'show-mobile-aside' : ''}`} style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <h3 style={styles.filterTitle}>
              <SlidersHorizontal size={16} />
              Refine Catalog
            </h3>
            <button onClick={handleResetFilters} style={styles.resetBtn}>Reset All</button>
          </div>

          <hr style={styles.divider} />

          {/* Search */}
          <div style={styles.filterGroup}>
            <label style={styles.label}>Search Text</label>
            <div style={styles.searchBox}>
              <input 
                type="text" 
                placeholder="Product name, brand..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={styles.searchInput}
              />
              <Search size={16} style={styles.searchIcon} />
            </div>
          </div>

          {/* Category */}
          <div style={styles.filterGroup}>
            <label style={styles.label}>Category</label>
            <div style={styles.radioGroup}>
              {categories.map((cat, i) => (
                <button 
                  key={i} 
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    ...styles.filterOption,
                    color: selectedCategory === cat ? 'var(--accent)' : 'var(--text-secondary)',
                    fontWeight: selectedCategory === cat ? 700 : 500
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Brand */}
          <div style={styles.filterGroup}>
            <label style={styles.label}>Design Label</label>
            <div style={styles.radioGroup}>
              {brands.map((br, i) => (
                <button 
                  key={i} 
                  onClick={() => setSelectedBrand(br)}
                  style={{
                    ...styles.filterOption,
                    color: selectedBrand === br ? 'var(--accent)' : 'var(--text-secondary)',
                    fontWeight: selectedBrand === br ? 700 : 500
                  }}
                >
                  {br}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div style={styles.filterGroup}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={styles.label}>Price Bracket</label>
              <span style={styles.priceRangeVal}>Max: ${maxPrice}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="500" 
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={styles.rangeInput}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.75rem', opacity: 0.6 }}>
              <span>$0</span>
              <span>$500+</span>
            </div>
          </div>

          {/* Ratings Filter */}
          <div style={styles.filterGroup}>
            <label style={styles.label}>Minimum Rating</label>
            <div style={styles.starsGroup}>
              {[0, 3, 4, 5].map((val) => (
                <button 
                  key={val} 
                  onClick={() => setMinRating(val)}
                  style={{
                    ...styles.ratingOption,
                    background: minRating === val ? 'var(--accent-glow)' : 'var(--bg-secondary)',
                    color: minRating === val ? 'var(--accent)' : 'var(--text-secondary)',
                    border: minRating === val ? '1px solid var(--accent)' : '1px solid var(--border-color)'
                  }}
                >
                  {val === 0 ? 'All' : `${val}★ & Up`}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Catalog List */}
        <main style={styles.catalog}>
          {/* Top Sort Row */}
          <div style={styles.sortRow}>
            <span style={styles.countText}>{products.length} Products Found</span>
            
            <div style={styles.sortControls}>
              {/* Mobile Filter Trigger Button */}
              <button 
                onClick={() => setShowMobileFilters(!showMobileFilters)} 
                className="btn btn-secondary" 
                style={styles.mobileFilterBtn}
              >
                <SlidersHorizontal size={14} />
                Filters
              </button>

              <div style={styles.sortSelectContainer}>
                <ArrowUpDown size={14} style={styles.sortIcon} />
                <select 
                  value={sort} 
                  onChange={(e) => setSort(e.target.value)} 
                  style={styles.sortSelect}
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Ratings: Highest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Catalog grid */}
          {loading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.loader}></div>
            </div>
          ) : products.length === 0 ? (
            <div style={styles.emptyContainer} className="glass-panel">
              <RefreshCw size={36} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
              <h3>No Matches Discovered</h3>
              <p>Try resetting some search conditions or adjusting your price boundary filters.</p>
              <button onClick={handleResetFilters} className="btn btn-primary" style={{ marginTop: '16px' }}>Reset Catalog</button>
            </div>
          ) : (
            <div className="products-grid">
              {products.map(prod => (
                <ProductCard key={prod._id || prod.id} product={prod} currency={currency} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const styles = {
  shop: {
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
  subtitle: {
    fontSize: '1rem',
    color: 'var(--text-secondary)'
  },
  layoutGrid: {
    display: 'grid',
    gridTemplateColumns: '300px 1fr',
    gap: '32px',
    alignItems: 'start',
    '@media (max-width: 992px)': {
      gridTemplateColumns: '1fr',
    }
  },
  sidebar: {
    padding: '24px',
    position: 'sticky',
    top: '100px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    background: 'var(--bg-tertiary)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-sm)',
    '@media (max-width: 992px)': {
      display: 'none', // Managed in mobile layout
    }
  },
  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  filterTitle: {
    fontSize: '1.05rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  resetBtn: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--accent)'
  },
  divider: {
    border: 'none',
    borderBottom: '1px solid var(--border-color)',
    margin: 0
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  label: {
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--text-muted)'
  },
  searchBox: {
    position: 'relative'
  },
  searchInput: {
    width: '100%',
    padding: '10px 12px',
    paddingRight: '36px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-color)',
    background: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    fontSize: '0.9rem'
  },
  searchIcon: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)'
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxHeight: '160px',
    overflowY: 'auto',
    paddingRight: '6px'
  },
  filterOption: {
    textAlign: 'left',
    fontSize: '0.9rem',
    padding: '4px 0',
    transition: 'var(--transition-smooth)'
  },
  priceRangeVal: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: 'var(--accent)'
  },
  rangeInput: {
    width: '100%',
    cursor: 'pointer',
    accentColor: 'var(--accent)'
  },
  starsGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  ratingOption: {
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '0.8rem',
    fontWeight: 600,
    transition: 'var(--transition-smooth)'
  },
  catalog: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  sortRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'var(--bg-secondary)',
    padding: '12px 20px',
    borderRadius: 'var(--radius-sm)',
    transition: 'background-color 0.4s ease'
  },
  countText: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: 'var(--text-secondary)'
  },
  sortControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  mobileFilterBtn: {
    display: 'none',
    padding: '8px 16px',
    fontSize: '0.85rem',
    '@media (max-width: 992px)': {
      display: 'inline-flex'
    }
  },
  sortSelectContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  sortIcon: {
    position: 'absolute',
    left: '12px',
    color: 'var(--text-muted)',
    pointerEvents: 'none'
  },
  sortSelect: {
    padding: '8px 12px 8px 32px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-color)',
    background: 'var(--bg-tertiary)',
    color: 'var(--text-primary)',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none'
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
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '80px 40px',
    background: 'var(--bg-tertiary)'
  }
};

export default Shop;
