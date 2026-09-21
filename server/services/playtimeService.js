const PlaytimeSnapshot = require('../models/PlaytimeSnapshot');

const RANGE_DAYS = {
    '2w': 14,
    '1m': 30,
    '3m': 90,
    '1y': 365
};

const isValidRange = (range) => range === 'all' || range in RANGE_DAYS;

// Minutes played per game inside the range, derived from snapshots.
// Baseline is the last snapshot before the range starts, or the first
// snapshot we have if tracking began after the range start.
const getPeriodMinutes = async (userId, games, range) => {
    const periodByApp = new Map();

    if (range === 'all') {
        games.forEach(game => periodByApp.set(game.appId, game.totalPlaytimeMinutes));
        return periodByApp;
    }

    if (range === '2w') {
        games.forEach(game => periodByApp.set(game.appId, game.playtimeLastTwoWeeks));
        return periodByApp;
    }

    const start = new Date(Date.now() - RANGE_DAYS[range] * 24 * 60 * 60 * 1000);

    const [beforeStart, firstEver] = await Promise.all([
        PlaytimeSnapshot.aggregate([
            { $match: { userId, capturedAt: { $lte: start } } },
            { $sort: { capturedAt: -1 } },
            { $group: { _id: '$appId', minutes: { $first: '$totalPlaytimeMinutes' } } }
        ]),
        PlaytimeSnapshot.aggregate([
            { $match: { userId } },
            { $sort: { capturedAt: 1 } },
            { $group: { _id: '$appId', minutes: { $first: '$totalPlaytimeMinutes' } } }
        ])
    ]);

    const baselineByApp = new Map(firstEver.map(row => [row._id, row.minutes]));
    beforeStart.forEach(row => baselineByApp.set(row._id, row.minutes));

    games.forEach(game => {
        const baseline = baselineByApp.get(game.appId) ?? game.totalPlaytimeMinutes;
        periodByApp.set(game.appId, Math.max(0, game.totalPlaytimeMinutes - baseline));
    });

    return periodByApp;
};

module.exports = { getPeriodMinutes, isValidRange };
