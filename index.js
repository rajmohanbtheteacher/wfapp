const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Home Route
app.get('/', (req, res) => {
    res.render('index', { forecast: null, error: null });
});

// Fetch Weather Data
app.post('/forecast', async (req, res) => {
    const city = req.body.city;
    const apiKey = 'fc7e573cde6d4908911f519c93c77a15'; // Replace with your Weatherbit API key

    if (!city || city.trim() === '') {
        res.render('index', { forecast: null, error: 'Please enter a valid city name.' });
        return;
    }

    try {
        // Get city coordinates
        const geoUrl = `https://api.weatherbit.io/v2.0/current?city=${encodeURIComponent(city)}&key=${apiKey}`;
        const geoResponse = await axios.get(geoUrl);

        if (geoResponse.data.count === 0) {
            throw new Error('City not found');
        }

        const { lat, lon } = geoResponse.data.data[0];

        // Get weather forecast using coordinates
        const forecastUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&days=7&key=${apiKey}`;
        const forecastResponse = await axios.get(forecastUrl);

        const forecast = forecastResponse.data.data.map(day => ({
            date: new Date(day.valid_date).toLocaleDateString(),
            temp: day.temp,
            description: day.weather.description,
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