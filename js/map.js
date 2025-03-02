const WEATHER_API_KEY = "65771a4b8c3db27049a4555b0224b8e8";
let map;
let marker;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 20, lng: 0 },
        zoom: 2,
        styles: [
            {
                featureType: "all",
                elementType: "labels.text.fill",
                stylers: [{ color: "#444444" }]
            }
        ]
    });

    const searchInput = document.getElementById('location-input');
    const searchBox = new google.maps.places.SearchBox(searchInput);

    map.addListener('click', async (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        
        if (marker) {
            marker.setMap(null);
        }

        marker = new google.maps.Marker({
            position: e.latLng,
            map: map,
            animation: google.maps.Animation.DROP
        });

        await fetchWeatherForLocation(lat, lng);
    });

    document.getElementById('search-btn').addEventListener('click', () => {
        const places = searchBox.getPlaces();
        if (places && places.length > 0) {
            const place = places[0];
            map.setCenter(place.geometry.location);
            map.setZoom(12);

            if (marker) {
                marker.setMap(null);
            }

            marker = new google.maps.Marker({
                position: place.geometry.location,
                map: map,
                animation: google.maps.Animation.DROP
            });

            fetchWeatherForLocation(
                place.geometry.location.lat(),
                place.geometry.location.lng()
            );
        }
    });
}

async function fetchWeatherForLocation(lat, lng) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}&units=metric`
        );
        const data = await response.json();
        updateWeatherOverlay(data);
    } catch (error) {
        console.error("Error fetching weather:", error);
    }
}

function updateWeatherOverlay(data) {
    const weatherContent = document.querySelector('.weather-content');
    weatherContent.innerHTML = `
        <div class="weather-info">
            <h4>${data.name}, ${data.sys.country}</h4>
            <div class="temp-info">
                <i class="fas fa-temperature-high"></i>
                <span>${Math.round(data.main.temp)}°C</span>
            </div>
            <p>${data.weather[0].description}</p>
            <div class="details">
                <p><i class="fas fa-droplet"></i> Humidity: ${data.main.humidity}%</p>
                <p><i class="fas fa-wind"></i> Wind: ${(data.wind.speed * 3.6).toFixed(1)} km/h</p>
            </div>
        </div>
    `;
}

// Initialize the map when the page loads
window.initMap = initMap;
