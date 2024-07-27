const express = require('express');

const router = express.Router();

const axios = require('axios');

const Weather = require('../models/Weather');
const auth = require('../middleware/authMiddleware');

router.get('/:city', async (req, res) => {
    try {
        const city = req.params.city;
        const apiKey = process.env.WEATHER_API_KEY;
        const response = await axios.get(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5`);

        console.log('API Response:', response.data);  // Log the full API response

        const currentWeather = response.data.current;
        const forecastWeather = response.data.forecast.forecastday;

        const weatherData = {
            city: response.data.location.name,
            temperature: currentWeather.temp_c,
            description: currentWeather.condition.text,
            rainfall: currentWeather.precip_mm,
            windSpeed: currentWeather.wind_kph,
            windDirection: currentWeather.wind_dir,
            forecast: forecastWeather.map(day => ({
                date: day.date,
                maxTemp: day.day.maxtemp_c,
                minTemp: day.day.mintemp_c,
                description: day.day.condition.text,
                rainfall: day.day.totalprecip_mm,
                windSpeed: day.day.maxwind_kph
            }))
        };

        console.log('Weather Data:', weatherData);  // Log the processed weather data

        res.json(weatherData);
    } catch (err) {
        console.log('Error:', err.message);
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



// Add this route to handle default city
router.get('/defaultCity', async (req, res) => {
    try {
        const defaultCity = 'London'; // You can change this to any city you want as default
        const response = await axios.get(
            `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${defaultCity}`
        );

        const weatherData = {
            city: response.data.location.name,
            temperature: response.data.current.temp_c,
            description: response.data.current.condition.text,
        };

        res.json(weatherData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});



module.exports = router;
 
