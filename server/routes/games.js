const express = require('express');
const { syncUserLibrary } = require('../services/syncService');
const router = express.Router();
const { runSnapshotForAllUsers } = require('../jobs/snapshotJob');

router.post('/sync', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not logged in' });
    }

    try {
        const gameCount = await syncUserLibrary(req.user);
        res.json({ message: `Synced ${gameCount} games`, gameCount });
    } catch (error) {
        console.log('Sync error:', error.message);
        res.status(500).json({ message: 'Sync failed' });
    }
});

router.post('/run-job', async (req, res) => {
    try {
        await runSnapshotForAllUsers();
        res.json({ message: 'Job completed - check server logs' });
    } catch (error) {
        res.status(500).json({ message: 'Job failed' });
    }
});

module.exports = router;