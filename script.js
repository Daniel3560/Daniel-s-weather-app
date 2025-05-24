const API_KEY = 'a5535c02ba9edc5a01ae71700b2a0e15';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Get references to HTML elements
const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-button');
const loadingSpinner = document.getElementById('loading-spinner');
const errorMessage = document.getElementById('error-message');
const weatherDisplay = document.getElementById('weather-display');

const cityNameElement = document.getElementById('city-name');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');
const weatherIconElement = document.getElementById('weather-icon');
const windSpeedElement = document.getElementById('wind-speed');
const humidityElement = document.getElementById('humidity');
const cloudsElement = document.getElementById('clouds');
const feelsLikeElement = document.getElementById('feels-like');

/**
 * Fetches weather data for a given city from OpenWeatherMap API.
 * @param {string} city - The name of the city.
 */
async function getWeatherData(city) {
    // Hide previous messages and display loading spinner
    hideElement(errorMessage);
    hideElement(weatherDisplay);
    showElement(loadingSpinner);

    try {
        const response = await fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`); // units=metric for Celsius

        if (!response.ok) {
            // Handle HTTP errors (e.g., 404 Not Found, 401 Unauthorized)
            if (response.status === 404) {
                throw new Error('City not found. Please check the spelling.');
            } else if (response.status === 401) {
                throw new Error('Invalid API key. Please check your API key in script.js.');
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        }

        const data = await response.json();
        displayWeatherData(data); // Display the fetched data
    } catch (error) {
        console.error('Error fetching weather data:', error);
        showError(error.message); // Show user-friendly error message
    } finally {
        hideElement(loadingSpinner); // Always hide spinner after request completes
    }
}

/**
 * Displays the fetched weather data on the webpage.
 * @param {object} data - The weather data object from the API.
 */
function displayWeatherData(data) {
    // Update text content
    cityNameElement.textContent = data.name;
    temperatureElement.textContent = `${Math.round(data.main.temp)}°C`;
    descriptionElement.textContent = data.weather[0].description;
    windSpeedElement.textContent = `${data.wind.speed} m/s`;
    humidityElement.textContent = `${data.main.humidity}%`;
    cloudsElement.textContent = `${data.clouds.all}%`;
    feelsLikeElement.textContent = `${Math.round(data.main.feels_like)}°C`;

    // Set weather icon
    const iconCode = data.weather[0].icon;
    weatherIconElement.src = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIconElement.alt = data.weather[0].description;

    // Update background based on weather condition
    updateBackground(data.weather[0].main);

    showElement(weatherDisplay); // Show the weather display section
}

/**
 * Updates the body background based on weather main condition.
 * @param {string} weatherMain - The main weather condition (e.g., "Clear", "Clouds", "Rain").
 */
function updateBackground(weatherMain) {
    // Remove all existing weather classes
    document.body.classList.remove('clear', 'clouds', 'rain', 'drizzle', 'thunderstorm', 'snow', 'mist', 'fog', 'haze');

    // Add the appropriate class based on weatherMain
    const lowerCaseWeather = weatherMain.toLowerCase();
    if (lowerCaseWeather.includes('clear')) {
        document.body.classList.add('clear');
    } else if (lowerCaseWeather.includes('cloud')) {
        document.body.classList.add('clouds');
    } else if (lowerCaseWeather.includes('rain')) {
        document.body.classList.add('rain');
    } else if (lowerCaseWeather.includes('drizzle')) {
        document.body.classList.add('drizzle');
    } else if (lowerCaseWeather.includes('thunderstorm')) {
        document.body.classList.add('thunderstorm');
    } else if (lowerCaseWeather.includes('snow')) {
        document.body.classList.add('snow');
    } else if (lowerCaseWeather.includes('mist') || lowerCaseWeather.includes('fog') || lowerCaseWeather.includes('haze')) {
        document.body.classList.add('mist');
    }
    // Default background will remain if no specific class matches
}


/**
 * Displays an error message to the user.
 * @param {string} message - The error message to display.
 */
function showError(message) {
    errorMessage.textContent = `Error: ${message}`;
    showElement(errorMessage);
    hideElement(weatherDisplay); // Hide weather display on error
}

/**
 * Utility function to show an HTML element.
 * @param {HTMLElement} element - The element to show.
 */
function showElement(element) {
    element.classList.remove('hidden');
}

/**
 * Utility function to hide an HTML element.
 * @param {HTMLElement} element - The element to hide.
 */
function hideElement(element) {
    element.classList.add('hidden');
}

// --- Event Listeners ---
searchButton.addEventListener('click', () => {
    const city = cityInput.value.trim(); // Get city name and remove whitespace
    if (city) {
        getWeatherData(city);
    } else {
        showError('Please enter a city name.');
    }
});

// Allow searching by pressing Enter key in the input field
cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchButton.click(); // Simulate a click on the search button
    }
});

// Initial load (optional: fetch weather for a default city)
document.addEventListener('DOMContentLoaded', () => {
    // You can uncomment the line below to load weather for a default city on page load
    // getWeatherData('London');
});