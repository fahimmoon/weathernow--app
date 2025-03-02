const searchButton = document.querySelector('.search-btn');
const cityInput = document.querySelector('.weather-input input');
const weatherDetails = document.querySelector('.details');

const API_KEY = "65771a4b8c3db27049a4555b0224b8e8"; // You'll need to add your weather API key here

searchButton.addEventListener('click', () => {
    if (cityInput.value.trim() === "") return;
    fetchWeatherData(cityInput.value);
});

async function fetchWeatherData(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        
        if (response.ok) {
            updateWeatherUI(data);
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

// Add weather icon mapping
const weatherIcons = {
    'Clear': '<i class="fas fa-sun"></i>',
    'Clouds': '<i class="fas fa-cloud"></i>',
    'Rain': '<i class="fas fa-cloud-rain"></i>',
    'Drizzle': '<i class="fas fa-cloud-rain"></i>',
    'Thunderstorm': '<i class="fas fa-bolt"></i>',
    'Snow': '<i class="fas fa-snowflake"></i>',
    'Mist': '<i class="fas fa-smog"></i>',
    'Smoke': '<i class="fas fa-smog"></i>',
    'Haze': '<i class="fas fa-smog"></i>',
    'Dust': '<i class="fas fa-smog"></i>',
    'Fog': '<i class="fas fa-smog"></i>',
};

function updateWeatherUI(data) {
    const weatherData = document.querySelector('.weather-data');
    const temperature = document.querySelector('.temperature');
    const description = document.querySelector('.description');
    const humidity = document.querySelector('.humidity');
    const windSpeed = document.querySelector('.wind-speed');
    const clouds = document.querySelector('.clouds');
    const feelsLike = document.querySelector('.feels-like');
    const pressure = document.querySelector('.pressure');
    const visibility = document.querySelector('.visibility');
    const location = document.querySelector('.location');

    // Format weather data
    const temp = Math.round(data.main.temp);
    const feelsLikeTemp = Math.round(data.main.feels_like);
    const windSpeedKmh = (data.wind.speed * 3.6).toFixed(1); // Convert m/s to km/h

    // Update values with formatted data
    temperature.textContent = `${temp}°`;
    description.textContent = data.weather[0].description;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${windSpeedKmh} km/h`;
    clouds.textContent = `${data.clouds.all}%`;
    feelsLike.textContent = `${feelsLikeTemp}°`;
    pressure.textContent = `${data.main.pressure} hPa`;
    visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
    location.textContent = `${data.name}, ${data.sys.country}`;
    
    // Update weather icon using Font Awesome
    const weatherMain = data.weather[0].main;
    const iconHTML = weatherIcons[weatherMain] || '<i class="fas fa-cloud"></i>';
    const weatherIconContainer = document.querySelector('.weather-icon');
    weatherIconContainer.innerHTML = iconHTML;

    // Show weather data with animation
    weatherData.classList.add('active');
    
    // Add background animations based on weather
    updateBackgroundAnimations(data.weather[0].main);
}

// Add background animation handling
function updateBackgroundAnimations(weatherMain) {
    const bgAnimations = document.querySelector('.bg-animations');
    bgAnimations.innerHTML = ''; // Clear existing animations

    switch(weatherMain) {
        case 'Clear':
            addSunAnimation();
            break;
        case 'Clouds':
            addCloudAnimation();
            break;
        case 'Rain':
        case 'Drizzle':
            addRainAnimation();
            break;
        default:
            addDefaultAnimation();
    }
}

function addCloudAnimation() {
    const bgAnimations = document.querySelector('.bg-animations');
    for (let i = 0; i < 3; i++) {
        const cloud = document.createElement('i');
        cloud.className = 'fas fa-cloud floating-cloud';
        bgAnimations.appendChild(cloud);
    }
}

function addRainAnimation() {
    const bgAnimations = document.querySelector('.bg-animations');
    for (let i = 0; i < 20; i++) {
        const drop = document.createElement('i');
        drop.className = 'fas fa-tint rain-drop';
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.animationDuration = `${0.5 + Math.random() * 1}s`;
        drop.style.animationDelay = `${Math.random() * 2}s`;
        bgAnimations.appendChild(drop);
    }
}

function addSunAnimation() {
    const bgAnimations = document.querySelector('.bg-animations');
    const sun = document.createElement('div');
    sun.className = 'sun-ray';
    sun.style.top = '10%';
    sun.style.right = '10%';
    bgAnimations.appendChild(sun);
}

function addDefaultAnimation() {
    addCloudAnimation();
}
