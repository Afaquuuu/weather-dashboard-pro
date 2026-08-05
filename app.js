// DOM Elements
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');

const loadingState = document.getElementById('loading-state');
const errorState = document.getElementById('error-state');
const errorMessage = document.getElementById('error-message');
const sidebarWeather = document.getElementById('sidebar-weather');
const mainContent = document.getElementById('main-content');
const appBg = document.getElementById('app-bg');

// Current Info
const cityNameEl = document.getElementById('city-name');
const countryNameEl = document.getElementById('country-name');
const dateTimeEl = document.getElementById('date-time');
const tempValueEl = document.getElementById('temp-value');
const weatherConditionEl = document.getElementById('weather-condition');
const mainWeatherIconEl = document.getElementById('main-weather-icon');
const precipValueEl = document.getElementById('precip-value');

// Highlights
const uvValueEl = document.getElementById('uv-value');
const uvTextEl = document.getElementById('uv-text');
const windValueEl = document.getElementById('wind-value');
const windDirTextEl = document.getElementById('wind-dir-text');
const sunriseTimeEl = document.getElementById('sunrise-time');
const sunsetTimeEl = document.getElementById('sunset-time');
const humidityValueEl = document.getElementById('humidity-value');
const humidityStatusEl = document.getElementById('humidity-status');
const visibilityValueEl = document.getElementById('visibility-value');
const visibilityStatusEl = document.getElementById('visibility-status');
const pressureValueEl = document.getElementById('pressure-value');
const pressureStatusEl = document.getElementById('pressure-status');

// Containers
const hourlyContainer = document.getElementById('hourly-container');
const dailyContainer = document.getElementById('daily-container');

// Tabs
const tabToday = document.getElementById('tab-today');
const tabWeek = document.getElementById('tab-week');
const sectionToday = document.getElementById('section-today');
const sectionWeek = document.getElementById('section-week');

if (tabToday && tabWeek && sectionToday && sectionWeek) {
  tabToday.addEventListener('click', () => {
    tabToday.classList.add('active');
    tabWeek.classList.remove('active');
    sectionToday.classList.remove('hidden');
    sectionWeek.classList.add('hidden');
  });

  tabWeek.addEventListener('click', () => {
    tabWeek.classList.add('active');
    tabToday.classList.remove('active');
    sectionWeek.classList.remove('hidden');
    sectionToday.classList.add('hidden');
  });
}

// Open-Meteo WMO Weather interpretation codes mapping
const weatherCodes = {
  0: { label: 'Clear sky', icon: 'ph-sun', bg: 'clear-day' },
  1: { label: 'Mainly clear', icon: 'ph-sun', bg: 'clear-day' },
  2: { label: 'Partly cloudy', icon: 'ph-cloud-sun', bg: 'cloudy' },
  3: { label: 'Overcast', icon: 'ph-cloud', bg: 'cloudy' },
  45: { label: 'Fog', icon: 'ph-cloud-fog', bg: 'cloudy' },
  48: { label: 'Depositing rime fog', icon: 'ph-cloud-fog', bg: 'cloudy' },
  51: { label: 'Light drizzle', icon: 'ph-cloud-rain', bg: 'rain' },
  53: { label: 'Moderate drizzle', icon: 'ph-cloud-rain', bg: 'rain' },
  55: { label: 'Dense drizzle', icon: 'ph-cloud-rain', bg: 'rain' },
  56: { label: 'Light freezing drizzle', icon: 'ph-cloud-snow', bg: 'snow' },
  57: { label: 'Dense freezing drizzle', icon: 'ph-cloud-snow', bg: 'snow' },
  61: { label: 'Slight rain', icon: 'ph-cloud-rain', bg: 'rain' },
  63: { label: 'Moderate rain', icon: 'ph-cloud-rain', bg: 'rain' },
  65: { label: 'Heavy rain', icon: 'ph-cloud-rain', bg: 'rain' },
  66: { label: 'Light freezing rain', icon: 'ph-cloud-snow', bg: 'snow' },
  67: { label: 'Heavy freezing rain', icon: 'ph-cloud-snow', bg: 'snow' },
  71: { label: 'Slight snow', icon: 'ph-snowflake', bg: 'snow' },
  73: { label: 'Moderate snow', icon: 'ph-snowflake', bg: 'snow' },
  75: { label: 'Heavy snow', icon: 'ph-snowflake', bg: 'snow' },
  77: { label: 'Snow grains', icon: 'ph-snowflake', bg: 'snow' },
  80: { label: 'Slight showers', icon: 'ph-cloud-showers', bg: 'rain' },
  81: { label: 'Moderate showers', icon: 'ph-cloud-showers', bg: 'rain' },
  82: { label: 'Violent showers', icon: 'ph-cloud-lightning', bg: 'rain' },
  85: { label: 'Slight snow showers', icon: 'ph-cloud-snow', bg: 'snow' },
  86: { label: 'Heavy snow showers', icon: 'ph-cloud-snow', bg: 'snow' },
  95: { label: 'Thunderstorm', icon: 'ph-cloud-lightning', bg: 'rain' },
  96: { label: 'Thunderstorm with hail', icon: 'ph-cloud-lightning', bg: 'rain' },
  99: { label: 'Heavy thunderstorm', icon: 'ph-cloud-lightning', bg: 'rain' }
};

const getIconAndBg = (code, isDay) => {
  const info = weatherCodes[code] || { label: 'Unknown', icon: isDay ? 'ph-sun' : 'ph-moon', bg: isDay ? 'clear-day' : 'clear-night' };
  let icon = info.icon;
  let bg = info.bg;
  
  if (!isDay) {
    if (icon === 'ph-sun') icon = 'ph-moon';
    if (icon === 'ph-cloud-sun') icon = 'ph-cloud-moon';
    if (bg === 'clear-day') bg = 'clear-night';
  }
  
  return { label: info.label, icon, bg };
};

// Wind direction helper
const getWindDir = (degree) => {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return dirs[Math.round(degree / 22.5) % 16];
};

function showState(state) {
  loadingState.classList.add('hidden');
  errorState.classList.add('hidden');
  sidebarWeather.classList.add('hidden');
  mainContent.classList.add('hidden');

  if (state === 'loading') loadingState.classList.remove('hidden');
  if (state === 'error') errorState.classList.remove('hidden');
  if (state === 'weather') {
    sidebarWeather.classList.remove('hidden');
    mainContent.classList.remove('hidden');
  }
}

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  let query = cityInput.value.trim();
  if (!query) return;

  // Map common country aliases that the geocoding API might confuse for exact-match villages
  const countryAliases = {
    'america': 'united states',
    'usa': 'united states',
    'us': 'united states',
    'uk': 'united kingdom',
    'england': 'united kingdom'
  };

  const normalizedQuery = query.toLowerCase();
  if (countryAliases[normalizedQuery]) {
    query = countryAliases[normalizedQuery];
  }

  showState('loading');
  
  try {
    // 1. Geocoding (Fetch up to 5 results to find a valid city)
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
    const geoData = await geoRes.json();
    if (!geoData.results || geoData.results.length === 0) throw new Error(`We couldn't find anything for "${query}".`);

    const bestMatch = geoData.results[0];

    // If the top match is a country (PCL...) or state/province (ADM...), reject it immediately
    // to prevent falling back to a random obscure village with the same name.
    if (bestMatch.feature_code) {
      if (bestMatch.feature_code.startsWith('PCL')) {
        throw new Error(`"${bestMatch.name}" is a country. Please search for a specific city.`);
      }
      if (bestMatch.feature_code.startsWith('ADM')) {
        throw new Error(`"${bestMatch.name}" is a region/state. Please search for a specific city.`);
      }
    }

    // Strict city check: find the first result that is actually a populated place (PPL, PPLA, etc.)
    const cityResult = geoData.results.find(r => r.feature_code && r.feature_code.startsWith('PPL'));
    
    if (!cityResult) {
      throw new Error(`We couldn't find a city matching "${query}".`);
    }

    // Strict Anti-Gibberish Filter: Requires EXACT spelling matches.
    // Prefix-matching is disabled as requested by the user.
    const isLogicalMatch = () => {
      const q = query.toLowerCase();
      
      const aliases = {
        'nyc': true, 'la': true, 'uk': true, 'usa': true, 'us': true, 'america': true
      };
      if (aliases[q]) return true;

      const fields = [cityResult.name, cityResult.admin1, cityResult.admin2, cityResult.country];
      
      // EXACT match only!
      for (let field of fields) {
        if (field && field.toLowerCase() === q) return true;
      }
      
      // Allow full word trailing extensions (like "New York City" for "New York")
      if (cityResult.name && q.startsWith(cityResult.name.toLowerCase() + ' ')) return true;
      
      return false;
    };

    if (!isLogicalMatch()) {
      throw new Error(`No exact match found for "${query}". Please check the spelling and try again.`);
    }

    const { latitude, longitude, name, country, timezone } = cityResult;

    // 2. Comprehensive Weather Data
    // We add timezone=auto so all times (hourly, sunrise/set) return in the local time of that city
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl,surface_pressure,visibility&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=${timezone || 'auto'}`;
    
    const weatherRes = await fetch(url);
    if (!weatherRes.ok) throw new Error('Failed to fetch weather data');
    const weatherData = await weatherRes.json();

    updateUI(name, country, weatherData);
    showState('weather');
    
  } catch (err) {
    console.error(err);
    errorMessage.textContent = err.message || 'An error occurred.';
    showState('error');
  }
});

function updateUI(name, country, data) {
  const current = data.current;
  const daily = data.daily;
  const hourly = data.hourly;
  
  // Format Date and Time using local timezone provided by API
  // Open-Meteo returns ISO strings in local time when timezone is set
  const localDate = new Date(current.time);
  const formatter = new Intl.DateTimeFormat('en-US', { weekday: 'long', hour: 'numeric', minute: 'numeric', hour12: true });
  dateTimeEl.textContent = formatter.format(localDate);

  cityNameEl.textContent = name;
  countryNameEl.textContent = country || '';
  tempValueEl.textContent = Math.round(current.temperature_2m);
  precipValueEl.textContent = current.precipitation || 0;
  
  const weatherInfo = getIconAndBg(current.weather_code, current.is_day);
  weatherConditionEl.textContent = weatherInfo.label;
  mainWeatherIconEl.className = `ph ${weatherInfo.icon}`;
  
  // Update App Background
  appBg.className = `app-bg ${weatherInfo.bg}`;

  // Highlights
  // UV Index
  const uv = daily.uv_index_max[0] || 0;
  uvValueEl.textContent = Math.round(uv);
  uvTextEl.textContent = uv < 3 ? 'Low' : uv < 6 ? 'Moderate' : uv < 8 ? 'High' : uv < 11 ? 'Very High' : 'Extreme';
  
  // Wind
  windValueEl.textContent = Math.round(current.wind_speed_10m);
  windDirTextEl.textContent = getWindDir(current.wind_direction_10m);
  
  // Sunrise/Sunset (extract just time from ISO string)
  const formatTime = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };
  sunriseTimeEl.textContent = formatTime(daily.sunrise[0]);
  sunsetTimeEl.textContent = formatTime(daily.sunset[0]);
  
  // Humidity
  const hum = current.relative_humidity_2m;
  humidityValueEl.textContent = hum;
  humidityStatusEl.textContent = hum < 30 ? 'Dry' : hum > 60 ? 'High' : 'Normal';
  
  // Visibility
  const visKm = current.visibility / 1000;
  visibilityValueEl.textContent = visKm.toFixed(1);
  visibilityStatusEl.textContent = visKm > 10 ? 'Good' : visKm > 5 ? 'Average' : 'Poor';
  
  // Pressure
  const pressure = current.surface_pressure;
  pressureValueEl.textContent = Math.round(pressure);
  pressureStatusEl.textContent = pressure > 1020 ? 'High' : pressure < 1000 ? 'Low' : 'Normal';

  // Render Hourly
  renderHourly(hourly, current.time);
  
  // Render Daily
  renderDaily(daily);
}

function renderHourly(hourly, currentTimeStr) {
  hourlyContainer.innerHTML = '';
  // Find current hour index (matching up to the hour, e.g. "YYYY-MM-DDTHH")
  const currentHourPrefix = currentTimeStr.substring(0, 13);
  const currentIndex = hourly.time.findIndex(t => t.substring(0, 13) === currentHourPrefix);
  const start = currentIndex !== -1 ? currentIndex : 0;
  
  // Show next 24 hours
  for (let i = start; i < start + 24 && i < hourly.time.length; i++) {
    const timeStr = hourly.time[i];
    const temp = Math.round(hourly.temperature_2m[i]);
    const code = hourly.weather_code[i];
    
    // basic day/night check for hourly based on hour (very rough)
    const hour = new Date(timeStr).getHours();
    const isDay = hour > 6 && hour < 18;
    const info = getIconAndBg(code, isDay);
    
    const displayTime = i === start ? 'Now' : new Date(timeStr).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
    
    hourlyContainer.innerHTML += `
      <div class="hourly-card">
        <span class="hourly-time">${displayTime}</span>
        <i class="ph ${info.icon} hourly-icon"></i>
        <span class="hourly-temp">${temp}°</span>
      </div>
    `;
  }
}

function renderDaily(daily) {
  dailyContainer.innerHTML = '';
  for (let i = 1; i < 7; i++) { // Skip today (index 0)
    const dateStr = daily.time[i];
    const minTemp = Math.round(daily.temperature_2m_min[i]);
    const maxTemp = Math.round(daily.temperature_2m_max[i]);
    const code = daily.weather_code[i];
    
    const dayName = new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
    const info = getIconAndBg(code, true);
    
    dailyContainer.innerHTML += `
      <div class="daily-card">
        <span class="daily-day">${dayName}</span>
        <div class="daily-icon-group">
          <i class="ph ${info.icon}"></i>
          <span class="daily-desc">${info.label}</span>
        </div>
        <div class="daily-temps">
          <span class="max">${maxTemp}°</span>
          <span class="min">${minTemp}°</span>
        </div>
      </div>
    `;
  }
}

// Initial default call if needed
// cityInput.value = 'New York';
// searchForm.dispatchEvent(new Event('submit'));
