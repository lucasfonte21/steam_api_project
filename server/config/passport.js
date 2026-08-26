const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;
const User = require('../models/User');

passport.use(new SteamStrategy({
    returnURL: 'http://localhost:5000/api/auth/steam/return',
    realm: 'http://localhost:5000/',
    apiKey: process.env.STEAM_API_KEY,
    }, async (identifier, profile, done) => {
    try {
        let user = await User.findOne({ steamId64: profile._json.steamid });

        if (!user) {
            user = await User.create({
                steamId64: profile._json.steamid,
                displayName: profile._json.personaname,
                avatarUrl: profile._json.avatarfull,
                profileUrl: profile._json.profileurl
            });
        }

        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;