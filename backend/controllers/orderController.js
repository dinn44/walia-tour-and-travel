const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const { MemoryDB } = require('../utils/memoryStore');
let stripe = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
}

// @desc    Create checkout session (Stripe or Mock fallback)
// @route   POST /api/orders/checkout
// @access  Private
exports.createCheckoutSession = async (req, res, next) => {
  try {
    const { items, shippingAddress, couponCode } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty' });
    }

    if (!shippingAddress) {
      return res.status(400).json({ success: false, message: 'Please provide shipping address' });
    }

    const isDbConnected = req.app.get('dbConnected');
    
    // 1. Calculate prices and verify stock
    let subtotal = 0;
    const checkoutItems = [];

    for (const item of items) {
      let product = null;
      if (isDbConnected) {
        product = await Product.findById(item.product._id || item.product.id);
      } else {
        product = await MemoryDB.products.findById(item.product._id || item.product.id);
      }

      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.product.title} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.title}` });
      }

      const itemPrice = product.price;
      subtotal += itemPrice * item.quantity;
      
      checkoutItems.push({
        product: product._id || product.id,
        quantity: item.quantity,
        price: itemPrice,
        title: product.title // Helper
      });
    }

    // 2. Validate and apply coupon if active
    let discount = 0;
    if (couponCode) {
      let coupon = null;
      if (isDbConnected) {
        coupon = await Coupon.findOne({ code: couponCode, isActive: true });
      } else {
        coupon = await MemoryDB.coupons.findOne({ code: couponCode });
      }

      if (coupon) {
        if (coupon.discountPercent > 0) {
          discount = (subtotal * coupon.discountPercent) / 100;
        } else if (coupon.discountAmount > 0) {
          discount = Math.min(coupon.discountAmount, subtotal);
        }
      }
    }

    const total = parseFloat((subtotal - discount).toFixed(2));

    // 3. Process with Stripe or Mock Checkout Flow
    if (stripe) {
      // Real Stripe Checkout Session Integration
      const lineItems = items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.title,
            description: item.product.description,
            images: item.product.images
          },
          unit_amount: Math.round(item.product.price * 100) // Cents
        },
        quantity: item.quantity
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${req.headers.origin}/orders?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/cart`,
        metadata: {
          userId: req.user.id,
          shippingAddress: JSON.stringify(shippingAddress)
        }
      });

      // Save a pending order in the database
      let order = null;
      const orderPayload = {
        user: req.user.id,
        items: checkoutItems,
        total,
        discount,
        paymentStatus: 'pending',
        stripeSessionId: session.id,
        shippingAddress
      };

      if (isDbConnected) {
        order = await Order.create(orderPayload);
      } else {
        order = await MemoryDB.orders.create(orderPayload);
      }

      return res.json({
        success: true,
        stripeUrl: session.url,
        orderId: order._id || order.id,
        message: 'Stripe session created successfully'
      });

    } else {
      // Mock Checkout Flow for seamless development/testing
      const stripeSessionId = `mock_session_${Date.now()}`;
      const orderPayload = {
        user: req.user.id,
        items: checkoutItems,
        total,
        discount,
        paymentStatus: 'paid', // Mark as paid instantly in mock mode
        stripeSessionId,
        shippingAddress,
        status: 'Processing'
      };

      let order = null;
      if (isDbConnected) {
        order = await Order.create(orderPayload);
        // Adjust product stock
        for (const item of checkoutItems) {
          await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
        }
      } else {
        order = await MemoryDB.orders.create(orderPayload);
        // Adjust product stock in memory
        for (const item of checkoutItems) {
          const prod = await MemoryDB.products.findById(item.product);
          if (prod) {
            await MemoryDB.products.findByIdAndUpdate(item.product, { stock: Math.max(0, prod.stock - item.quantity) });
          }
        }
      }

      return res.status(201).json({
        success: true,
        message: 'Mock Checkout Payment completed successfully.',
        orderId: order._id || order.id,
        order
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const isDbConnected = req.app.get('dbConnected');
    let myOrders = [];

    if (isDbConnected) {
      myOrders = await Order.find({ user: req.user.id }).populate('items.product').sort('-createdAt');
    } else {
      const allOrders = await MemoryDB.orders.find();
      const rawUserOrders = allOrders.filter(o => {
        const orderUserId = o.user.id || o.user;
        return orderUserId.toString() === req.user.id.toString();
      });
      
      // Populate items product manually in memory
      for (const ord of rawUserOrders) {
        const hydratedItems = [];
        for (const it of ord.items) {
          const prod = await MemoryDB.products.findById(it.product);
          hydratedItems.push({
            ...it,
            product: prod
          });
        }
        myOrders.push({
          ...ord,
          items: hydratedItems
        });
      }
      myOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.json({
      success: true,
      count: myOrders.length,
      orders: myOrders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order details by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isDbConnected = req.app.get('dbConnected');

    let order = null;

    if (isDbConnected) {
      order = await Order.findById(id).populate('items.product').populate('user', 'name email');
    } else {
      const rawOrder = await MemoryDB.orders.findById(id);
      if (rawOrder) {
        const hydratedItems = [];
        for (const it of rawOrder.items) {
          const prod = await MemoryDB.products.findById(it.product);
          hydratedItems.push({
            ...it,
            product: prod
          });
        }
        
        // Find raw user in memory
        const orderUserId = rawOrder.user.id || rawOrder.user;
        const ordUser = await MemoryDB.users.findById(orderUserId);

        order = {
          ...rawOrder,
          items: hydratedItems,
          user: ordUser ? { name: ordUser.name, email: ordUser.email } : { name: "Guest Customer", email: "guest@din.com" }
        };
      }
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Security: Check if order belongs to user or user is admin
    const orderUserId = order.user._id || order.user.id || order.user;
    if (orderUserId.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};
