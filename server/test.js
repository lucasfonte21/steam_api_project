//This is to test the server is actually pulling the correct information

require('dotenv').config();
const axios = require('axios');

const API_KEY = process.env.STEAM_API_KEY;
const STEAM_ID = process.env.STEAM_ID_64;

const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${API_KEY}&steamid=${STEAM_ID}&format=json&include_appinfo=true`;

axios.get(url)
    .then(response => {
        console.log('Success, here is the data: ');
        console.log(JSON.stringify(response.data, null, 2));
    })
    .catch(error => {
        console.log("Something is wrong: ");
        console.log(error.message);
    });

