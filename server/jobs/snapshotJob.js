const cron = require('node-cron');
const User = require('../models/User');
const { syncUserLibrary } = require('../services/syncService');

const runSnapshotForAllUsers = async () => {
    console.log('Snapshot job starting at', new Date().toISOString());

    try {
        const users = await User.find({});
        console.log(`Found ${users.length} users to sync`);

        for (const user of users) {
            try {
                const gameCount = await syncUserLibrary(user);
                console.log(`Synced ${gameCount} games for ${user.displayName}`);
            } catch (error) {
                console.log(`Failed to sync ${user.displayName}:`, error.message);
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        console.log('Snapshot job finished');
    } catch (error) {
        console.log('Snapshot job error:', error.message);
    }
};

const startSnapshotJob = () => {
    cron.schedule('0 */12 * * *', runSnapshotForAllUsers);
    console.log('Snapshot job scheduled (every 12 hours)');
};

module.exports = { startSnapshotJob, runSnapshotForAllUsers };