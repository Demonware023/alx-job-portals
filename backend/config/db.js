const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// MongoDB connection URL
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/job-portal';

const connectDB = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1); // Exit the process with failure
    }
};

// Export the connection function
module.exports = connectDB;
