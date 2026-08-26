const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/steam', passport.authenticate('steam'));

router.get('/steam/return',
    passport.authenticate('steam', {failureRedirect: '/'}),
    (req, res) => {
        res.redirect('http://localhost:5173/dashboard');
    }
);


router.get('/logout', (req, res) => {
    req.logout((err) => {
        if(err){
            return res.status(500).json({message: 'Logout failed'});
        }
        res.redirect('http://localhost:5173/');
    });
});

router.get('/me', (req, res) => {
    if (req.isAuthenticated()){
        res.json({user: req.user});
    }
    else {
        res.status(401).json({message: 'Not logged in'});
    }
});

module.exports = router;