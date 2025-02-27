const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

const API_KEY = "cc0ec4f3436947d287153915252702"; // WeatherAPI.com API Key

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Home Route
app.get('/', (req, res) => {
    res.render('index', { forecast: null, error: null });
});

// Fetch Weather Data from WeatherAPI.com
app.post('/forecast', async (req, res) => {
    const city = req.body.city;

    if (!city || city.trim() === '') {
        res.render('index', { forecast: null, error: 'Please enter a valid city name.' });
        return;
    }

    try {
        // Get 7-day weather forecast
        const forecastUrl = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=7&aqi=no&alerts=no`;
        const response = await axios.get(forecastUrl);

        const forecast = response.data.forecast.forecastday.map(day => ({
            date: day.date,
            temp: day.day.avgtemp_c,
            condition: day.day.condition.text,
            icon: day.day.condition.icon
        }));

        res.render('index', { forecast, error: null });
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.render('index', { forecast: null, error: 'City not found or API error.' });
    }
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
