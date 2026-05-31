const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a product title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a product description']
  },
  price: {
    type: Number,
    required: [true, 'Please add a product price'],
    min: [0, 'Price must be positive']
  },
  category: {
    type: String,
    required: [true, 'Please add a category']
  },
  brand: {
    type: String,
    required: [true, 'Please add a brand']
  },
  images: [{
    type: String,
    default: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800']
  }],
  stock: {
    type: Number,
    required: [true, 'Please add stock inventory count'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  ratings: {
    type: Number,
    default: 0
  },
  reviews: [ReviewSchema],
  features: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.Product || mongoose.model('Product', ProductSchema);
