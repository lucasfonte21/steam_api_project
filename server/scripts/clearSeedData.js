require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const PlaytimeSnapshot = require('../models/PlaytimeSnapshot');

const clearSeedData = async () => {
    await connectDB();

    const result = await PlaytimeSnapshot.deleteMany({ isSeedData: true });
    console.log(`Deleted ${result.deletedCount} seed snapshots`);

    await mongoose.connection.close();
    process.exit(0);
};

clearSeedData().catch(error => {
    console.log('Cleanup failed:', error.message);
    process.exit(1);
});