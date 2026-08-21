//imports
const express = require('express');
const cors = require('cors');
require('dotenv').config();

//setup
const app = express();
const PORT = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})