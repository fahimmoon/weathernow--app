const WEATHER_API_KEY = "65771a4b8c3db27049a4555b0224b8e8";
const MAP_API_KEY = "AIzaSyDvYkH7DQ1tBAMLRHFm_4I47rqwbE2Zu5k";
let map;
let marker;

// Update error handling
function handleMapError() {
    const mapDiv = document.getElementById('map');
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.remove();
    }
    
    mapDiv.innerHTML = `
        <div class="map-error">
            <i class="fas fa-exclamation-triangle"></i>
            <p>Error loading map. Please refresh the page or try again later.</p>
            <button onclick="window.location.reload()" class="retry-btn">
                <i class="fas fa-redo"></i> Retry
            </button>
        </div>
    `;
}

// Remove the DOMContentLoaded listener since we're using callback
function initMap() {
    // Remove loading overlay
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.remove();
    }

    try {
        // Check if Google Maps is loaded
        if (!google || !google.maps) {
            throw new Error('Google Maps not loaded');
        }

        // Create map with default options
        map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 20, lng: 0 },
            zoom: 2,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: true,
            fullscreenControl: true,
            streetViewControl: false,
            styles: [
                {
                    featureType: "all",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#444444" }]
                }
            ]
        });

        // Initialize search box after map is loaded
        google.maps.event.addListenerOnce(map, 'idle', () => {
            initSearchBox();
        });
        
        // Add map click listener
        map.addListener('click', async (e) => {
            placeMarker(e.latLng);
            await fetchWeatherForLocation(e.latLng.lat(), e.latLng.lng());
        });

    } catch (error) {
        console.error("Error initializing map:", error);
        handleMapError();
    }
}

function initSearchBox() {
    const searchInput = document.getElementById('location-input');
    const searchBox = new google.maps.places.SearchBox(searchInput);

    // Bias search box results towards current map viewport
    map.addListener('bounds_changed', () => {
        searchBox.setBounds(map.getBounds());
    });

    // Search box event listeners
    searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();
        if (places && places.length > 0) {
            const place = places[0];
            map.setCenter(place.geometry.location);
            map.setZoom(12);
            placeMarker(place.geometry.location);
            fetchWeatherForLocation(
                place.geometry.location.lat(),
                place.geometry.location.lng()
            );
        }
    });

    // Search button click event
    document.getElementById('search-btn').addEventListener('click', () => {
        const places = searchBox.getPlaces();
        if (places && places.length > 0) {
            const place = places[0];
            map.setCenter(place.geometry.location);
            map.setZoom(12);
            placeMarker(place.geometry.location);
            fetchWeatherForLocation(
                place.geometry.location.lat(),
                place.geometry.location.lng()
            );
        }
    });

    // Enter key press in search input
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('search-btn').click();
        }
    });
}

function placeMarker(location) {
    if (marker) {
        marker.setMap(null);
    }
    marker = new google.maps.Marker({
        position: location,
        map: map,
        animation: google.maps.Animation.DROP
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

// Add loading indicator
function showLoadingIndicator() {
    const mapDiv = document.getElementById('map');
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'map-loading';
    loadingDiv.innerHTML = '<i class="fas fa-spinner"></i>';
    mapDiv.appendChild(loadingDiv);
}

function hideLoadingIndicator() {
    const loadingDiv = document.querySelector('.map-loading');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

// Make initMap globally available
window.initMap = initMap;
