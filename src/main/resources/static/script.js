const API_BASE_URL = 'http://localhost:9090/api';

// DOM Elements
const appContainer = document.getElementById('appContainer');
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const errorDiv = document.getElementById('error');
const errorText = document.getElementById('errorText');
const weatherCard = document.getElementById('weatherCard');
const defaultMessage = document.getElementById('defaultMessage');
const currentTimeDiv = document.getElementById('currentTime');

// Weather data elements
const cityName = document.getElementById('cityName');
const temp = document.getElementById('temp');
const description = document.getElementById('description');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const visibility = document.getElementById('visibility');
const weatherIcon = document.getElementById('weatherIcon');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    addInteractiveEnhancements();
    optimizePerformance();
});

function initializeApp() {
    updateTime();
    updateBackground();
    setupEventListeners();

    // Update time every second
    setInterval(updateTime, 1000);

    // Update background every minute
    setInterval(updateBackground, 60000);

    // Initialize display
    hideWeatherCard();
    showDefaultMessage();
}

function setupEventListeners() {
    // Search functionality
    searchBtn.addEventListener('click', searchWeather);
    cityInput.addEventListener('keypress', handleKeyPress);

    // Quick city buttons
    document.querySelectorAll('.quick-city-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            handleQuickCityClick(e);
        });
    });

    // Input focus effects
    cityInput.addEventListener('focus', handleInputFocus);
    cityInput.addEventListener('blur', handleInputBlur);
}

function handleKeyPress(e) {
    if (e.key === 'Enter') {
        searchWeather();
    }
}

function handleQuickCityClick(e) {
    const city = e.currentTarget.getAttribute('data-city');
    cityInput.value = city;

    // Add visual feedback
    e.currentTarget.style.transform = 'scale(0.95)';
    setTimeout(() => {
        e.currentTarget.style.transform = '';
    }, 150);

    // Search immediately
    searchWeather();
}

function handleInputFocus() {
    const inputWrapper = document.querySelector('.search-input-wrapper');
    inputWrapper.style.transform = 'scale(1.02)';
}

function handleInputBlur() {
    const inputWrapper = document.querySelector('.search-input-wrapper');
    inputWrapper.style.transform = 'scale(1)';
}

function updateTime() {
    const now = new Date();
    const options = {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    currentTimeDiv.textContent = now.toLocaleDateString('en-US', options);
}

function updateBackground() {
    const hour = new Date().getHours();

    // Remove existing time classes
    appContainer.classList.remove('morning', 'afternoon', 'evening', 'night');

    if (hour >= 5 && hour < 12) {
        appContainer.classList.add('morning');
    } else if (hour >= 12 && hour < 17) {
        appContainer.classList.add('afternoon');
    } else if (hour >= 17 && hour < 20) {
        appContainer.classList.add('evening');
    } else {
        appContainer.classList.add('night');
    }
}

async function searchWeather() {
    const city = cityInput.value.trim();

    if (!city) {
        showError('Please enter a city name');
        return;
    }

    setLoading(true);
    hideError();
    hideWeatherCard();

    try {
        const response = await fetch(`${API_BASE_URL}/weather?city=${encodeURIComponent(city)}`);

        if (!response.ok) {
            throw new Error('City not found');
        }

        const data = await response.json();
        displayWeather(data);

        // Add success animation
        addSuccessAnimation();

    } catch (error) {
        showError('Failed to fetch weather data. Please try again.');
        console.error('Weather fetch error:', error);
    } finally {
        setLoading(false);
    }
}

function displayWeather(data) {
    // Populate weather data
    cityName.textContent = `${data.name}, ${data.country}`;
    temp.textContent = Math.round(data.temperature);
    description.textContent = data.description;
    humidity.textContent = `${data.humidity}%`;
    windSpeed.textContent = `${data.windSpeed} m/s`;
    visibility.textContent = `${data.visibility} km`;

    // Set weather icon
    weatherIcon.className = getWeatherIconClass(data.description);

    // Show weather card with animation
    showWeatherCard();
    hideDefaultMessage();

    // Scroll to weather card on mobile
    if (window.innerWidth <= 768) {
        setTimeout(() => {
            weatherCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    }
}

function getWeatherIconClass(description) {
    const desc = description.toLowerCase();
    const baseClass = 'weather-icon ';

    if (desc.includes('rain') || desc.includes('drizzle')) {
        return baseClass + 'fas fa-cloud-rain';
    } else if (desc.includes('snow')) {
        return baseClass + 'fas fa-snowflake';
    } else if (desc.includes('cloud')) {
        return baseClass + 'fas fa-cloud';
    } else if (desc.includes('clear')) {
        return baseClass + 'fas fa-sun';
    } else if (desc.includes('mist') || desc.includes('fog')) {
        return baseClass + 'fas fa-smog';
    } else if (desc.includes('thunder')) {
        return baseClass + 'fas fa-bolt';
    } else {
        return baseClass + 'fas fa-sun';
    }
}

function showWeatherCard() {
    weatherCard.classList.remove('hidden');

    // Add stagger animation to stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.style.animation = 'slideUp 0.5s ease-out forwards';
    });
}

function hideWeatherCard() {
    weatherCard.classList.add('hidden');
}

function showDefaultMessage() {
    defaultMessage.classList.remove('hidden');
}

function hideDefaultMessage() {
    defaultMessage.classList.add('hidden');
}

function showError(message) {
    errorText.textContent = message;
    errorDiv.classList.remove('hidden');

    // Auto-hide error after 5 seconds
    setTimeout(() => {
        hideError();
    }, 5000);
}

function hideError() {
    errorDiv.classList.add('hidden');
}

function setLoading(loading) {
    if (loading) {
        searchBtn.innerHTML = `
            <div class="loading"></div>
            <span>Searching...</span>
        `;
        searchBtn.disabled = true;
        cityInput.disabled = true;
    } else {
        searchBtn.innerHTML = `
            <i class="fas fa-search"></i>
            <span>Search Weather</span>
        `;
        searchBtn.disabled = false;
        cityInput.disabled = false;
    }
}

function addSuccessAnimation() {
    // Add a subtle success animation to the search button
    searchBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    setTimeout(() => {
        searchBtn.style.background = '';
    }, 1000);
}

// Add some interactive enhancements
function addInteractiveEnhancements() {
    // Add hover sound effect (optional)
    const buttons = document.querySelectorAll('button, .quick-city-btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transition = 'all 0.2s ease';
        });
    });

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            cityInput.blur();
            hideError();
        }
    });

    // Add touch feedback for mobile
    if ('ontouchstart' in window) {
        const touchElements = document.querySelectorAll('.quick-city-btn, .search-button, .stat-card');
        touchElements.forEach(element => {
            element.addEventListener('touchstart', () => {
                element.style.transform = 'scale(0.98)';
            });

            element.addEventListener('touchend', () => {
                setTimeout(() => {
                    element.style.transform = '';
                }, 150);
            });
        });
    }
}

// Add performance optimizations
function optimizePerformance() {
    // Debounce search input
    let searchTimeout;
    cityInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            // Could add auto-suggestions here
        }, 300);
    });

    // Lazy load animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.6s ease-out forwards';
            }
        });
    }, observerOptions);

    // Observe elements for lazy animation
    document.querySelectorAll('.stat-card, .quick-city-btn').forEach(el => {
        observer.observe(el);
    });
}

// Add error handling for network issues
window.addEventListener('online', () => {
    console.log('Connection restored');
    hideError();
});

window.addEventListener('offline', () => {
    showError('No internet connection. Please check your network.');
});

// Add service worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Could register a service worker here for offline functionality
    });
}