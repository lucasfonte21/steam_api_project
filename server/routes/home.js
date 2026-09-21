const express = require('express');
const GameLibraryEntry = require('../models/GameLibraryEntry');
const User = require('../models/User');
const { getPlayerSummaries, getFriendIds } = require('../services/steamService');
const router = express.Router();

const MAX_FRIENDS_SHOWN = 12;
const RECENT_GAMES_SHOWN = 6;

const requireLogin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not logged in' });
    }
    next();
};

router.use(requireLogin);

router.get('/now-playing', async (req, res) => {
    try {
        const [me] = await getPlayerSummaries([req.user.steamId64]);

        const recent = await GameLibraryEntry.find({ userId: req.user._id, lastPlayedAt: { $ne: null } })
            .sort({ lastPlayedAt: -1 })
            .limit(RECENT_GAMES_SHOWN)
            .select('appId name lastPlayedAt playtimeLastTwoWeeks')
            .lean();

        const currentGame = me && me.gameid
            ? { appId: Number(me.gameid), name: me.gameextrainfo }
            : null;

        res.json({ currentGame, recent });
    } catch (error) {
        console.log('Now playing error:', error.message);
        res.status(500).json({ message: 'Failed to load activity' });
    }
});

router.get('/friends', async (req, res) => {
    try {
        const friendIds = await getFriendIds(req.user.steamId64);

        if (friendIds === null) {
            return res.json({ friends: [], isPrivate: true });
        }

        const [players, appUsers] = await Promise.all([
            getPlayerSummaries(friendIds.slice(0, 100)),
            User.find({ steamId64: { $in: friendIds } }).select('steamId64').lean()
        ]);

        const onApp = new Set(appUsers.map(user => user.steamId64));

        const friends = players
            .map(player => ({
                steamId: player.steamid,
                name: player.personaname,
                avatarUrl: player.avatarfull,
                isOnline: player.personastate > 0,
                game: player.gameid ? { appId: Number(player.gameid), name: player.gameextrainfo } : null,
                lastLogoff: player.lastlogoff ? player.lastlogoff * 1000 : null,
                onApp: onApp.has(player.steamid)
            }))
            .sort((a, b) => {
                if (Boolean(b.game) !== Boolean(a.game)) return b.game ? 1 : -1;
                if (b.isOnline !== a.isOnline) return b.isOnline ? 1 : -1;
                return (b.lastLogoff || 0) - (a.lastLogoff || 0);
            })
            .slice(0, MAX_FRIENDS_SHOWN);

        res.json({ friends, isPrivate: false, totalFriends: friendIds.length });
    } catch (error) {
        console.log('Friend activity error:', error.message);
        res.status(500).json({ message: 'Failed to load friends' });
    }
});

module.exports = router;
