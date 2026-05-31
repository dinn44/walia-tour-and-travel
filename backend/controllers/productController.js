const Product = require('../models/Product');
const User = require('../models/User');
const { MemoryDB } = require('../utils/memoryStore');

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, rating, brand, search } = req.query;
    const isDbConnected = req.app.get('dbConnected');

    let allProducts = [];
    if (isDbConnected) {
      allProducts = await Product.find({});
    } else {
      allProducts = await MemoryDB.products.find({});
    }

    // Apply filtering
    let filtered = [...allProducts];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
      );
    }

    if (category && category !== 'All') {
      filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (brand) {
      filtered = filtered.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
    }

    if (minPrice) {
      filtered = filtered.filter(p => p.price >= parseFloat(minPrice));
    }

    if (maxPrice) {
      filtered = filtered.filter(p => p.price <= parseFloat(maxPrice));
    }

    if (rating) {
      filtered = filtered.filter(p => p.ratings >= parseFloat(rating));
    }

    res.json({
      success: true,
      count: filtered.length,
      products: filtered
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product by ID & update recently viewed
// @route   GET /api/products/:id
// @access  Public/Optional Private (via query/headers)
exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId; // Optional pass to update recently viewed
    const isDbConnected = req.app.get('dbConnected');

    let product = null;
    if (isDbConnected) {
      product = await Product.findById(id);
    } else {
      product = await MemoryDB.products.findById(id);
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // If userId provided, add to recentlyViewed array
    if (userId) {
      if (isDbConnected) {
        const user = await User.findById(userId);
        if (user) {
          // Remove if already exists to push to front
          const index = user.recentlyViewed.indexOf(id);
          if (index > -1) user.recentlyViewed.splice(index, 1);
          user.recentlyViewed.unshift(id);
          // Limit to last 5 items
          if (user.recentlyViewed.length > 5) user.recentlyViewed.pop();
          await user.save();
        }
      } else {
        const user = await MemoryDB.users.findById(userId);
        if (user) {
          const index = user.recentlyViewed.indexOf(id);
          if (index > -1) user.recentlyViewed.splice(index, 1);
          user.recentlyViewed.unshift(id);
          if (user.recentlyViewed.length > 5) user.recentlyViewed.pop();
          await MemoryDB.users.update(userId, { recentlyViewed: user.recentlyViewed });
        }
      }
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a review
// @route   POST /api/products/:id/reviews
// @access  Private
exports.addReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    
    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide rating and comment' });
    }

    const isDbConnected = req.app.get('dbConnected');
    let product = null;

    if (isDbConnected) {
      product = await Product.findById(id);
    } else {
      product = await MemoryDB.products.findById(id);
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      r => r.user === req.user.name
    );

    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    const review = {
      user: req.user.name,
      rating: Number(rating),
      comment,
      createdAt: new Date()
    };

    if (isDbConnected) {
      product.reviews.push(review);
      const totalRatings = product.reviews.reduce((acc, item) => item.rating + acc, 0);
      product.ratings = parseFloat((totalRatings / product.reviews.length).toFixed(1));
      await product.save();
    } else {
      product = await MemoryDB.products.findByIdAndUpdate(id, { $push: { reviews: review } });
    }

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      reviews: product.reviews,
      ratings: product.ratings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI product recommendations
// @route   GET /api/products/recommendations/ai
// @access  Public/Optional Private
exports.getAIRecommendations = async (req, res, next) => {
  try {
    const userId = req.query.userId;
    const isDbConnected = req.app.get('dbConnected');

    let allProds = [];
    if (isDbConnected) {
      allProds = await Product.find({});
    } else {
      allProds = await MemoryDB.products.find({});
    }

    // Default: Pick top rated products
    let recommended = [...allProds]
      .sort((a, b) => b.ratings - a.ratings)
      .slice(0, 4);

    if (userId) {
      let user = null;
      if (isDbConnected) {
        user = await User.findById(userId);
      } else {
        user = await MemoryDB.users.findById(userId);
      }

      if (user && (user.wishlist.length > 0 || user.recentlyViewed.length > 0)) {
        // Find categories user interacts with
        const userProductIds = [...user.wishlist, ...user.recentlyViewed];
        const userCategories = new Set();

        for (const pid of userProductIds) {
          const prod = allProds.find(p => p.id === pid.toString() || p._id.toString() === pid.toString());
          if (prod) userCategories.add(prod.category);
        }

        if (userCategories.size > 0) {
          // Filter products in user categories, excluding already wishlisted/viewed items
          const matchingProds = allProds.filter(
            p => userCategories.has(p.category) && !userProductIds.includes(p._id.toString() || p.id)
          );

          if (matchingProds.length > 0) {
            // Sort by ratings and return
            recommended = matchingProds
              .sort((a, b) => b.ratings - a.ratings)
              .slice(0, 4);
          }
        }
      }
    }

    res.json({
      success: true,
      recommendations: recommended
    });
  } catch (error) {
    next(error);
  }
};
