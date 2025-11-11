const map = L.map('map').setView([50.4501, 30.516], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

async function fetchRestaurants() {
    const response = await fetch('/api/restaurants');
    return await response.json();
}

async function addRestaurantsToMap(restaurants) {
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    restaurants.forEach(restaurant => {
        const marker = L.marker([restaurant.latitude, restaurant.longitude]).addTo(map);
        marker.bindPopup(`
            <h3>${restaurant.name}</h3>
            <p>Rating: ${restaurant.rating}</p>
            <p>${restaurant.description}</p>
        `);
    });
}

document.getElementById('filter').addEventListener('change', async (e) => {
    const selectedCuisine = e.target.value;
    const restaurants = await fetchRestaurants();

    const filteredRestaurants = selectedCuisine === 'all' ? restaurants : restaurants.filter(r => r.cuisine === selectedCuisine);
    addRestaurantsToMap(filteredRestaurants);
});

document.getElementById('add-restaurant-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const newRestaurant = {
        name: document.getElementById('name').value,
        description: document.getElementById('description').value,
        rating: Number(document.getElementById('rating').value),
        cuisine: document.getElementById('cuisine').value,
        latitude: parseFloat(document.getElementById('latitude').value),
        longitude: parseFloat(document.getElementById('longitude').value)
    };

    console.log(newRestaurant);

    const response = await fetch('/api/restaurants', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRestaurant)
    });

    if (response.ok) {
        const restaurants = await fetchRestaurants();
        addRestaurantsToMap(restaurants);
    } else {
        console.error('Error adding restaurant:', response.statusText);
    }
});

(async () => {
    const restaurants = await fetchRestaurants();
    addRestaurantsToMap(restaurants);
})();
