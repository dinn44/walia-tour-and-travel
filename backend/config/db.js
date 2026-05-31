const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/din_ecommerce';
  
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000 // 5 seconds timeout
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[Database] Connection to MongoDB failed: ${error.message}`);
    console.warn('[Database] Falling back to In-Memory/Local JSON data emulation for seamless out-of-the-box operation.');
    return false;
  }
};

module.exports = connectDB;
