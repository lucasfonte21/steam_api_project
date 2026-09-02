const express = require('express');
const axios = require('axios');
const GameLibraryEntry = require('../models/GameLibraryEntry');
const User = require('../models/User');
const router = express.Router();

router.post('/sync', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not logged in' });
    }

    try {
        const steamId = req.user.steamId64;
        const apiKey = process.env.STEAM_API_KEY;

        const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamId}&format=json&include_appinfo=true&include_played_free_games=true`;
        
        const response = await axios.get(url);
        const games = response.data.response.games || [];

        for (const game of games) {
            await GameLibraryEntry.findOneAndUpdate(
                { userId: req.user._id, appId: game.appid },
                {
                    userId: req.user._id,
                    appId: game.appid,
                    name: game.name,
                    totalPlaytimeMinutes: game.playtime_forever,
                    playtimeLastTwoWeeks: game.playtime_2weeks || 0,
                    imgIconUrl: game.img_icon_url,
                    lastSyncedAt: new Date()
                },
                { upsert: true, new: true }
            );
        }

        await User.findByIdAndUpdate(req.user._id, { lastSyncedAt: new Date() });

        res.json({ message: `Synced ${games.length} games`, gameCount: games.length });

    } catch (error) {
        console.log('Sync error:', error.message);
        res.status(500).json({ message: 'Sync failed' });
    }
});

module.exports = router;