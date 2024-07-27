const express = require('express');

const router = express.Router();

const axios = require('axios');

const Weather = require('../models/Weather');
const auth = require('../middleware/authMiddleware');

router.get('/:city', async (req, res) => {
    try {
        const city = req.params.city;
        const response = await axios.get(
            `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${city}`
        );

        const weatherData = {
            city: response.data.location.name,
            temperature: response.data.current.temp_c,
            description: response.data.current.condition.text,
        };

        res.json(weatherData);
    } catch(err){
    console.error(err.message);
    res.status(500).send('Server error');
    }
});


router.post('/favorites', auth, async(req, res) => {
    try{
        const {city, temperature, description} = req.body;

        const newWeather = new Weather({
            city,
            temperature,
            description,
            user: req.user.id,
        });

        const weather = await newWeather.save();

        res.json(weather);
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});



router.get('/favorites', auth,  async (req, res) => {
    try {
        const weather = await Weather.find({user: req.user.is});

        res.json(weather);
    } catch (err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
