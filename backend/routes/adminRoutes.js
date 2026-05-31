const express = require('express');
const router = express.Router();
const { 
  getDashboardStats, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getAllOrders, 
  updateOrderStatus, 
  getAllUsers 
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Enforce admin-only protections across all dashboard routes
router.use(protect);
router.use(adminOnly);

router.get('/stats', getDashboardStats);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/users', getAllUsers);

router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

module.exports = router;
