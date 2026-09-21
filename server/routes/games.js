const express = require('express');
const { syncUserLibrary } = require('../services/syncService');
const router = express.Router();
const { runSnapshotForAllUsers } = require('../jobs/snapshotJob');
const GameLibraryEntry = require('../models/GameLibraryEntry');
const { getPeriodMinutes, isValidRange } = require('../services/playtimeService');

router.get('/', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not logged in' });
    }

    const range = req.query.range || '2w';
    if (!isValidRange(range)) {
        return res.status(400).json({ message: 'Invalid range' });
    }

    try {
        const games = await GameLibraryEntry.find({ userId: req.user._id })
            .select('appId name totalPlaytimeMinutes playtimeLastTwoWeeks lastPlayedAt')
            .lean();

        const periodByApp = await getPeriodMinutes(req.user._id, games, range);
        const withPeriod = games.map(game => ({
            ...game,
            periodMinutes: periodByApp.get(game.appId) || 0
        }));

        res.json({ games: withPeriod, range, lastSyncedAt: req.user.lastSyncedAt });
    } catch (error) {
        console.log('Library fetch error:', error.message);
        res.status(500).json({ message: 'Failed to load library' });
    }
});

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