const bcrypt = require('bcryptjs');

// Seed products
const seedProducts = [
  {
    id: "prod-1",
    _id: "prod-1",
    title: "Minimalist Chronograph Onyx",
    description: "A precision-crafted timepiece featuring an all-black obsidian matte finish, sapphire crystal glass, and Japanese quartz movement. Water-resistant up to 5ATM.",
    price: 185.00,
    category: "Timepieces",
    brand: "DIN Signature",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 24,
    ratings: 4.8,
    reviews: [
      { id: "rev-1", user: "Alexander V.", rating: 5, comment: "Absolutely stunning watch. The matte black finish is gorgeous.", createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
      { id: "rev-2", user: "Serena K.", rating: 4, comment: "Elegant and minimal. Feels extremely premium on the wrist.", createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) }
    ],
    features: ["Matte Finish", "Sapphire Glass", "Japanese Quartz", "5ATM Water Resistant"]
  },
  {
    id: "prod-2",
    _id: "prod-2",
    title: "Lux Suede Courier Bag",
    description: "Handcrafted from top-grade Italian suede and reinforced with full-grain vachetta leather straps. Perfectly fits a 15-inch laptop and your daily essentials.",
    price: 320.00,
    category: "Leather Goods",
    brand: "DIN Atelier",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 12,
    ratings: 4.9,
    reviews: [
      { id: "rev-3", user: "Marcus D.", rating: 5, comment: "The quality of the suede is incredible. Worth every single dollar.", createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
    ],
    features: ["Italian Suede", "15-inch Laptop Slot", "Solid Brass Hardware", "Adjustable Strap"]
  },
  {
    id: "prod-3",
    _id: "prod-3",
    title: "AeroPolar Sunglasses",
    description: "Ultralight titanium aviators designed with polarized premium mineral lenses. Offers 100% UVA/UVB protection and a smudge-resistant hydrophobic coating.",
    price: 145.00,
    category: "Eyewear",
    brand: "DIN Optics",
    images: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 35,
    ratings: 4.6,
    reviews: [
      { id: "rev-4", user: "Helena B.", rating: 5, comment: "So lightweight I forget I'm wearing them. The polarization is crystal clear.", createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
      { id: "rev-5", user: "Dmitri G.", rating: 4, comment: "Stylish design and perfect fit. Packaging was also super high-end.", createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000) }
    ],
    features: ["Titanium Frame", "Polarized Lenses", "Hydrophobic Coating", "UV400 Protection"]
  },
  {
    id: "prod-4",
    _id: "prod-4",
    title: "Signature Cashmere Knit",
    description: "Woven from 100% Grade-A Mongolian cashmere. Exceptionally soft, lightweight, and thermo-regulating for year-round effortless comfort.",
    price: 210.00,
    category: "Apparel",
    brand: "DIN Lounge",
    images: [
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 18,
    ratings: 4.7,
    reviews: [
      { id: "rev-6", user: "Clara M.", rating: 5, comment: "Unbelievably soft. Fits true to size and feels like a cloud.", createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) }
    ],
    features: ["100% Cashmere", "Thermo-regulating", "Ribbed Trims", "Eco-friendly Dye"]
  },
  {
    id: "prod-5",
    _id: "prod-5",
    title: "Nomad Brass Desk Light",
    description: "An architectural table lamp cast in solid spun brass with a travertine stone base. Integrated dimmable LED bulb outputs warm ambient light.",
    price: 260.00,
    category: "Living",
    brand: "DIN Casa",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 8,
    ratings: 4.9,
    reviews: [
      { id: "rev-7", user: "Julian R.", rating: 5, comment: "An absolute masterpiece. Elevates my entire desk setup.", createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    ],
    features: ["Solid Brass", "Travertine Stone Base", "Dimmable LED", "Warm Tone (2700K)"]
  },
  {
    id: "prod-6",
    _id: "prod-6",
    title: "Atelier Leather Chelsea Boots",
    description: "Classic Chelsea boots constructed with premium calfskin leather, elastic side panels, and durable Goodyear welt construction. Built to last a lifetime.",
    price: 295.00,
    category: "Footwear",
    brand: "DIN Atelier",
    images: [
      "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 15,
    ratings: 4.8,
    reviews: [
      { id: "rev-8", user: "Toby S.", rating: 5, comment: "Perfect boots. Sizing was exact and they broke in beautifully after two days.", createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) }
    ],
    features: ["Calfskin Leather", "Goodyear Welted", "Elastic Gussets", "Leather Outsole"]
  }
];

// Seed Coupons
const seedCoupons = [
  { id: "coup-1", code: "DINWELCOME10", discountPercent: 10, discountAmount: 0, description: "10% off your introductory purchase", isActive: true },
  { id: "coup-2", code: "DINSPRING20", discountPercent: 20, discountAmount: 0, description: "20% seasonal spring discount", isActive: true },
  { id: "coup-3", code: "DINVIP50", discountPercent: 0, discountAmount: 50, description: "Flat $50 off premium orders", isActive: true }
];

// In-Memory Database Store Arrays
const users = [];
const products = [...seedProducts];
const coupons = [...seedCoupons];
const orders = [];

// Seed an initial Admin user for testing
const salt = bcrypt.genSaltSync(10);
const hashedAdminPassword = bcrypt.hashSync("admin123", salt);
const hashedCustomerPassword = bcrypt.hashSync("customer123", salt);

users.push({
  id: "user-admin",
  _id: "user-admin",
  name: "DIN Administrator",
  email: "admin@din.com",
  password: hashedAdminPassword,
  role: "admin",
  wishlist: [],
  recentlyViewed: [],
  createdAt: new Date()
});

users.push({
  id: "user-cust",
  _id: "user-cust",
  name: "Jane Doe",
  email: "customer@din.com",
  password: hashedCustomerPassword,
  role: "customer",
  wishlist: ["prod-1", "prod-3"],
  recentlyViewed: ["prod-2"],
  createdAt: new Date()
});

// Seed some test orders to populate admin analytics initially
orders.push({
  id: "ord-1",
  _id: "ord-1",
  user: { id: "user-cust", name: "Jane Doe", email: "customer@din.com" },
  items: [
    { product: seedProducts[0], quantity: 1, price: 185.00 },
    { product: seedProducts[2], quantity: 1, price: 145.00 }
  ],
  total: 330.00,
  discount: 0,
  paymentStatus: "paid",
  stripeSessionId: "mock_stripe_session_1",
  shippingAddress: { name: "Jane Doe", street: "100 Obsidian Way", city: "New York", country: "USA", zip: "10001" },
  status: "Delivered",
  createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
});

orders.push({
  id: "ord-2",
  _id: "ord-2",
  user: { id: "user-cust", name: "Jane Doe", email: "customer@din.com" },
  items: [
    { product: seedProducts[1], quantity: 1, price: 320.00 }
  ],
  total: 288.00,
  discount: 32.00,
  paymentStatus: "paid",
  stripeSessionId: "mock_stripe_session_2",
  shippingAddress: { name: "Jane Doe", street: "100 Obsidian Way", city: "New York", country: "USA", zip: "10001" },
  status: "Shipped",
  createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
});

orders.push({
  id: "ord-3",
  _id: "ord-3",
  user: { id: "user-cust", name: "Jane Doe", email: "customer@din.com" },
  items: [
    { product: seedProducts[3], quantity: 2, price: 210.00 }
  ],
  total: 420.00,
  discount: 0,
  paymentStatus: "paid",
  stripeSessionId: "mock_stripe_session_3",
  shippingAddress: { name: "Jane Doe", street: "100 Obsidian Way", city: "New York", country: "USA", zip: "10001" },
  status: "Processing",
  createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
});

// Memory Database Service Layer
const MemoryDB = {
  users: {
    find: async () => users,
    findOne: async (query) => {
      if (query.email) {
        return users.find(u => u.email.toLowerCase() === query.email.toLowerCase()) || null;
      }
      if (query._id || query.id) {
        const targetId = query._id || query.id;
        return users.find(u => u.id === targetId || u._id === targetId) || null;
      }
      return null;
    },
    findById: async (id) => users.find(u => u.id === id || u._id === id) || null,
    create: async (userData) => {
      const newUser = {
        id: `user-${Date.now()}`,
        _id: `user-${Date.now()}`,
        role: 'customer',
        wishlist: [],
        recentlyViewed: [],
        createdAt: new Date(),
        ...userData
      };
      users.push(newUser);
      return newUser;
    },
    update: async (id, updateData) => {
      const userIdx = users.findIndex(u => u.id === id || u._id === id);
      if (userIdx !== -1) {
        users[userIdx] = { ...users[userIdx], ...updateData };
        return users[userIdx];
      }
      return null;
    }
  },
  
  products: {
    find: async () => products,
    findById: async (id) => products.find(p => p.id === id || p._id === id) || null,
    create: async (prodData) => {
      const newProd = {
        id: `prod-${Date.now()}`,
        _id: `prod-${Date.now()}`,
        ratings: 5.0,
        reviews: [],
        features: prodData.features || [],
        images: prodData.images || ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800"],
        ...prodData,
        price: parseFloat(prodData.price) || 0,
        stock: parseInt(prodData.stock) || 0
      };
      products.push(newProd);
      return newProd;
    },
    findByIdAndUpdate: async (id, updateData, options) => {
      const prodIdx = products.findIndex(p => p.id === id || p._id === id);
      if (prodIdx !== -1) {
        // Handle MongoDB style push
        if (updateData.$push && updateData.$push.reviews) {
          const newReview = { id: `rev-${Date.now()}`, createdAt: new Date(), ...updateData.$push.reviews };
          products[prodIdx].reviews.push(newReview);
          
          // Recompute average rating
          const sum = products[prodIdx].reviews.reduce((acc, r) => acc + r.rating, 0);
          products[prodIdx].ratings = parseFloat((sum / products[prodIdx].reviews.length).toFixed(1));
          return products[prodIdx];
        }
        
        products[prodIdx] = { ...products[prodIdx], ...updateData };
        return products[prodIdx];
      }
      return null;
    },
    findByIdAndDelete: async (id) => {
      const prodIdx = products.findIndex(p => p.id === id || p._id === id);
      if (prodIdx !== -1) {
        const deleted = products[prodIdx];
        products.splice(prodIdx, 1);
        return deleted;
      }
      return null;
    }
  },

  coupons: {
    find: async () => coupons,
    findOne: async (query) => {
      if (query.code) {
        return coupons.find(c => c.code.toUpperCase() === query.code.toUpperCase() && c.isActive) || null;
      }
      return null;
    },
    create: async (couponData) => {
      const newCoupon = {
        id: `coup-${Date.now()}`,
        _id: `coup-${Date.now()}`,
        isActive: true,
        ...couponData
      };
      coupons.push(newCoupon);
      return newCoupon;
    }
  },

  orders: {
    find: async () => orders,
    findById: async (id) => orders.find(o => o.id === id || o._id === id) || null,
    findByUser: async (userId) => orders.filter(o => o.user.id === userId),
    create: async (orderData) => {
      const newOrder = {
        id: `ord-${Date.now()}`,
        _id: `ord-${Date.now()}`,
        createdAt: new Date(),
        status: "Pending",
        paymentStatus: "paid",
        ...orderData
      };
      orders.push(newOrder);
      return newOrder;
    },
    findByIdAndUpdate: async (id, updateData) => {
      const orderIdx = orders.findIndex(o => o.id === id || o._id === id);
      if (orderIdx !== -1) {
        orders[orderIdx] = { ...orders[orderIdx], ...updateData };
        return orders[orderIdx];
      }
      return null;
    }
  }
};

module.exports = { MemoryDB };
