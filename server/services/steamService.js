const axios = require('axios');

const STEAM_API = 'https://api.steampowered.com';

const getPlayerSummaries = async (steamIds) => {
    if (steamIds.length === 0) {
        return [];
    }

    const response = await axios.get(`${STEAM_API}/ISteamUser/GetPlayerSummaries/v2/`, {
        params: { key: process.env.STEAM_API_KEY, steamids: steamIds.join(',') }
    });

    return response.data.response.players || [];
};

// Steam rejects the request when the user's friends list is private.
const getFriendIds = async (steamId) => {
    try {
        const response = await axios.get(`${STEAM_API}/ISteamUser/GetFriendList/v1/`, {
            params: { key: process.env.STEAM_API_KEY, steamid: steamId, relationship: 'friend' }
        });

        return response.data.friendslist.friends.map(friend => friend.steamid);
    } catch (error) {
        return null;
    }
};

module.exports = { getPlayerSummaries, getFriendIds };
