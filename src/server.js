// server.js - Main server entry point

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/database'); // MongoDB connection utility

// Load environment variables from .env file
require('dotenv').config({
    path: require('path').resolve(__dirname, '../.env')
});

if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set');
}


// Import route modules
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users'); // Import user routes

const app = express();
const PORT = process.env.PORT || 3000;

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
});

// Readiness check endpoint
app.get('/ready', (req, res) => {
    res.status(200).json({ status: 'ready' });
});

// Middleware setup
app.use(cors()); // Enable CORS for frontend requests
app.use(express.json()); // Parse JSON request bodies

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes); // Mount user routes here

// Basic test route
app.get('/', (req, res) => {
    res.json({ message: 'Todo Backend API is running!' });
});

// Start server function that connects to MongoDB first then listens
const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

const shutdown = async () => {
    console.log('Shutdown signal received');
    process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);


// Invoke start function
startServer();
