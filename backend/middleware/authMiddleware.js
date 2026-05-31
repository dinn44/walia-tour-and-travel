const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { MemoryDB } = require('../utils/memoryStore');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'din_premium_key_secret_2026');

      const isDbConnected = req.app.get('dbConnected');
      
      if (isDbConnected) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        req.user = await MemoryDB.users.findById(decoded.id);
      }

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error('[Auth Middleware] Token validation failed:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token verification failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ success: false, message: 'Forbidden: Access restricted to Administrators only' });
  }
};

module.exports = { protect, adminOnly };
