const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const { MemoryDB } = require('../utils/memoryStore');

// @desc    Get dashboard analytics statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    const isDbConnected = req.app.get('dbConnected');
    
    let allOrders = [];
    let allProducts = [];
    let allUsers = [];

    if (isDbConnected) {
      allOrders = await Order.find({});
      allProducts = await Product.find({});
      allUsers = await User.find({ role: 'customer' });
    } else {
      allOrders = await MemoryDB.orders.find();
      allProducts = await MemoryDB.products.find();
      allUsers = (await MemoryDB.users.find()).filter(u => u.role === 'customer');
    }

    // 1. Calculate Revenue
    // Only count paid orders
    const paidOrders = allOrders.filter(o => o.paymentStatus === 'paid');
    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.total, 0);

    // 2. Low Stock Alerts
    const lowStockCount = allProducts.filter(p => p.stock <= 5).length;

    // 3. Category Breakdown
    const categoryCount = {};
    allProducts.forEach(p => {
      categoryCount[p.category] = (categoryCount[p.category] || 0) + p.stock;
    });

    // 4. Sales Trends (Group by last 7 days)
    const salesTrends = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const dayTotal = paidOrders
        .filter(o => new Date(o.createdAt).toDateString() === d.toDateString())
        .reduce((sum, o) => sum + o.total, 0);

      salesTrends.push({
        date: dateStr,
        sales: parseFloat(dayTotal.toFixed(2))
      });
    }

    res.json({
      success: true,
      stats: {
        totalSales: parseFloat(totalRevenue.toFixed(2)),
        ordersCount: allOrders.length,
        customersCount: allUsers.length,
        productsCount: allProducts.length,
        lowStockCount,
        categoryBreakdown: categoryCount,
        salesTrends
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add product
// @route   POST /api/admin/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    const { title, description, price, category, brand, stock, images, features } = req.body;
    
    if (!title || !description || !price || !category || !brand) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const isDbConnected = req.app.get('dbConnected');
    let product = null;

    const parsedFeatures = Array.isArray(features) ? features : (features ? features.split(',').map(f => f.trim()) : []);

    const productPayload = {
      title,
      description,
      price: parseFloat(price),
      category,
      brand,
      stock: parseInt(stock) || 0,
      images: (images && images.length > 0) ? images : undefined,
      features: parsedFeatures
    };

    if (isDbConnected) {
      product = await Product.create(productPayload);
    } else {
      product = await MemoryDB.products.create(productPayload);
    }

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isDbConnected = req.app.get('dbConnected');
    let product = null;

    if (isDbConnected) {
      product = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    } else {
      product = await MemoryDB.products.findByIdAndUpdate(id, req.body);
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isDbConnected = req.app.get('dbConnected');
    let product = null;

    if (isDbConnected) {
      product = await Product.findByIdAndDelete(id);
    } else {
      product = await MemoryDB.products.findByIdAndDelete(id);
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin index)
// @route   GET /api/admin/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res, next) => {
  try {
    const isDbConnected = req.app.get('dbConnected');
    let ordersList = [];

    if (isDbConnected) {
      ordersList = await Order.find({}).populate('items.product').populate('user', 'name email').sort('-createdAt');
    } else {
      const rawOrders = await MemoryDB.orders.find();
      for (const ord of rawOrders) {
        const hydratedItems = [];
        for (const it of ord.items) {
          const prod = await MemoryDB.products.findById(it.product);
          hydratedItems.push({
            ...it,
            product: prod
          });
        }
        
        const orderUserId = ord.user.id || ord.user;
        const ordUser = await MemoryDB.users.findById(orderUserId);

        ordersList.push({
          ...ord,
          items: hydratedItems,
          user: ordUser ? { name: ordUser.name, email: ordUser.email } : { name: "Guest Customer", email: "guest@din.com" }
        });
      }
      ordersList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.json({
      success: true,
      count: ordersList.length,
      orders: ordersList
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Please provide status' });
    }

    const isDbConnected = req.app.get('dbConnected');
    let order = null;

    if (isDbConnected) {
      order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    } else {
      order = await MemoryDB.orders.findByIdAndUpdate(id, { status });
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (Customer Index)
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const isDbConnected = req.app.get('dbConnected');
    let usersList = [];

    if (isDbConnected) {
      usersList = await User.find({}).select('-password').sort('-createdAt');
    } else {
      usersList = (await MemoryDB.users.find()).map(u => {
        const { password, ...safeUser } = u;
        return safeUser;
      });
    }

    res.json({
      success: true,
      count: usersList.length,
      users: usersList
    });
  } catch (error) {
    next(error);
  }
};
