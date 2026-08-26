const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;

passport.use(new SteamStrategy({
    returnURL: 'http://localhost:5000/api/auth/steam/return',
    realm: 'http://localhost:5000/',
    apiKey: process.env.STEAM_API_KEY
    }, (identifier, profile, done) => {
        profilde.identifier = identifier;
        return done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, user);
})

passport.deserializeUser((obj, done) => {
    done(null, obj);
}); 

module.exports = passport;