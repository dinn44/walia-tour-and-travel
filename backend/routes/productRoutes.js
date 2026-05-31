const express = require('express');
const router = express.Router();
const { getProducts, getProductById, addReview, getAIRecommendations } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getProducts);
router.get('/recommendations/ai', getAIRecommendations);
router.get('/:id', getProductById);
router.post('/:id/reviews', protect, addReview);

module.exports = router;
