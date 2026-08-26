//imports
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const session = require('express-session');
const passport = require('./config/passport');
require('dotenv').config();

//setup
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

//middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


app.get('/api/test', (req, res) => {
    res.json({ message: 'hello from server' });
});

//start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})