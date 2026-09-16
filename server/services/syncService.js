const axios = require('axios');
const GameLibraryEntry = require('../models/GameLibraryEntry');
const PlaytimeSnapshot = require('../models/PlaytimeSnapshot');
const User = require('../models/User');

const syncUserLibrary = async (user) => {
    const apiKey = process.env.STEAM_API_KEY;
    const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${user.steamId64}&format=json&include_appinfo=true&include_played_free_games=true`;

    const response = await axios.get(url);
    const games = response.data.response.games || [];

    for (const game of games) {
        await GameLibraryEntry.findOneAndUpdate(
            { userId: user._id, appId: game.appid },
            {
                userId: user._id,
                appId: game.appid,
                name: game.name,
                totalPlaytimeMinutes: game.playtime_forever,
                playtimeLastTwoWeeks: game.playtime_2weeks || 0,
                imgIconUrl: game.img_icon_url,
                lastSyncedAt: new Date()
            },
            { upsert: true, returnDocument: 'after' }
        );

        await PlaytimeSnapshot.create({
            userId: user._id,
            appId: game.appid,
            totalPlaytimeMinutes: game.playtime_forever
        });
    }

    await User.findByIdAndUpdate(user._id, { lastSyncedAt: new Date() });

    return games.length;
};

module.exports = { syncUserLibrary };