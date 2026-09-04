const mongoose = require('mongoose');

// Disable buffering so queries never hang if DB is offline
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sih_portal', {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Note: ${error.message} (Using local persistent store fallback)`);
  }
};

module.exports = connectDB;
