const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
const { MemoryDB } = require('../utils/memoryStore');

// Utility to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'din_premium_key_secret_2026', {
    expiresIn: '30d'
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all details' });
    }

    const isDbConnected = req.app.get('dbConnected');

    // Check if user already exists
    let existingUser = null;
    if (isDbConnected) {
      existingUser = await User.findOne({ email });
    } else {
      existingUser = await MemoryDB.users.findOne({ email });
    }

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // Create user
    let user = null;
    if (isDbConnected) {
      user = await User.create({ name, email, password });
    } else {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
      user = await MemoryDB.users.create({ name, email, password: hashedPassword });
    }

    res.status(201).json({
      success: true,
      token: generateToken(user._id || user.id),
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const isDbConnected = req.app.get('dbConnected');
    let user = null;

    if (isDbConnected) {
      user = await User.findOne({ email }).select('+password');
    } else {
      user = await MemoryDB.users.findOne({ email });
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password match
    let isMatch = false;
    if (isDbConnected) {
      isMatch = await user.matchPassword(password);
    } else {
      isMatch = bcrypt.compareSync(password, user.password);
    }

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.json({
      success: true,
      token: generateToken(user._id || user.id),
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const isDbConnected = req.app.get('dbConnected');
    let user = null;

    if (isDbConnected) {
      user = await User.findById(req.user.id).populate('wishlist').populate('recentlyViewed');
    } else {
      user = await MemoryDB.users.findById(req.user.id);
      // Hydrate wishlist & recently viewed details in memory fallback
      if (user) {
        const fullWishlist = [];
        for (const pid of user.wishlist) {
          const item = await MemoryDB.products.findById(pid);
          if (item) fullWishlist.push(item);
        }
        
        const fullRecent = [];
        for (const pid of user.recentlyViewed) {
          const item = await MemoryDB.products.findById(pid);
          if (item) fullRecent.push(item);
        }

        user = {
          ...user,
          wishlist: fullWishlist,
          recentlyViewed: fullRecent
        };
      }
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        wishlist: user.wishlist,
        recentlyViewed: user.recentlyViewed
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle Wishlist
// @route   POST /api/auth/wishlist/:productId
// @access  Private
exports.toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const isDbConnected = req.app.get('dbConnected');
    let updatedUser = null;

    if (isDbConnected) {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      const idx = user.wishlist.indexOf(productId);
      if (idx > -1) {
        user.wishlist.splice(idx, 1);
      } else {
        user.wishlist.push(productId);
      }
      await user.save();
      updatedUser = await User.findById(req.user.id).populate('wishlist');
    } else {
      const user = await MemoryDB.users.findById(req.user.id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      const idx = user.wishlist.indexOf(productId);
      if (idx > -1) {
        user.wishlist.splice(idx, 1);
      } else {
        user.wishlist.push(productId);
      }
      updatedUser = await MemoryDB.users.update(req.user.id, { wishlist: user.wishlist });
      
      const fullWishlist = [];
      for (const pid of updatedUser.wishlist) {
        const item = await MemoryDB.products.findById(pid);
        if (item) fullWishlist.push(item);
      }
      updatedUser = { ...updatedUser, wishlist: fullWishlist };
    }

    res.json({
      success: true,
      wishlist: updatedUser.wishlist
    });
  } catch (error) {
    next(error);
  }
};
