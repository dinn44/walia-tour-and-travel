const express = require('express');
const router = express.Router();
const { createCheckoutSession, getMyOrders, getOrderById } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/checkout', protect, createCheckoutSession);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

module.exports = router;
