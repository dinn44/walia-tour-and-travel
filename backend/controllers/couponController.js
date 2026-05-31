const Coupon = require('../models/Coupon');
const { MemoryDB } = require('../utils/memoryStore');

// @desc    Validate coupon code
// @route   POST /api/coupons/validate
// @access  Private
exports.validateCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Please provide coupon code' });
    }

    const isDbConnected = req.app.get('dbConnected');
    let coupon = null;

    if (isDbConnected) {
      coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    } else {
      coupon = await MemoryDB.coupons.findOne({ code: code.toUpperCase() });
    }

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or expired coupon code' });
    }

    res.json({
      success: true,
      message: 'Coupon code validated successfully',
      coupon: {
        code: coupon.code,
        discountPercent: coupon.discountPercent,
        discountAmount: coupon.discountAmount,
        description: coupon.description
      }
    });
  } catch (error) {
    next(error);
  }
};
