const mongoose = require('mongoose');

// Replace the following with your Atlas connection string
const url = process.env.ATLAS_URI || '';

// Connect to your Atlas cluster with Mongoose
async function connectDB() {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Successfully connected to Atlas.');
        return mongoose.connection; // Return the Mongoose connection
    } catch (err) {
        console.error('Error connecting to Atlas:', err);
        process.exit(1); // Exit in case of connection failure
    }
}

module.exports = connectDB;
