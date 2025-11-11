const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3001;

mongoose.connect('mongodb://localhost:27017/restaurants', { useNewUrlParser: true, useUnifiedTopology: true });

const restaurantSchema = new mongoose.Schema({
    name: String,
    description: String,
    rating: Number,
    cuisine: String,
    latitude: Number,
    longitude: Number
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

app.use(express.json());

app.get('/api/restaurants', async (req, res) => {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
});

app.post('/api/restaurants', async (req, res) => {
    const newRestaurant = new Restaurant(req.body);
    await newRestaurant.save();
    res.status(201).send(newRestaurant);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
