const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};

// Import models from /models
const User = require('../models/User');
const Task = require('../models/Task');

module.exports = { connectDB, User, Task };
