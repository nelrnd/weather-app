const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('location-search-input');
const tempSwitch = document.getElementById('temp-switch');

let weatherInfo = null;
let degree_unit = 'celsius';

searchForm.onsubmit = handleSearch;
tempSwitch.onchange = handleTempSwitch;

async function handleSearch(e) {
  e.preventDefault();

  const location = searchInput.value;
  const data = await getWeatherData(location);
  weatherInfo = getWeatherInfo(data);
  displayWeatherInfo(weatherInfo);

  // Clear input after search
  searchInput.value = '';
}

async function getWeatherData(location) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=f18ef5d5f0e1ffb4959bcbf4a5704d2d`,
    {
      mode: 'cors',
    }
  );

  const data = await response.json();

  console.log(data);

  return data;
}

function handleTempSwitch() {
  if (degree_unit === 'celsius') {
    degree_unit = 'fahrenheit';
  } else {
    degree_unit = 'celsius';
  }

  if (weatherInfo) {
    displayWeatherInfo(weatherInfo);
  }
}

function getWeatherInfo(data) {
  const info = {};

  info.city = data.name;
  info.country = data.sys.country;
  info.desc = data.weather[0].description;
  info.temp = data.main.temp;
  info.feels_like = data.main.feels_like;
  info.visibility = data.visibility;
  info.humidity = data.main.humidity;
  info.pressure = data.main.pressure;
  info.wind_speed = data.wind.speed;
  info.wind_dir = data.wind.deg;
  info.sunrise = data.sys.sunrise;
  info.sunset = data.sys.sunset;
  info.timezone = data.timezone;

  return info;
}

function displayWeatherInfo(info) {
  const container = document.getElementById('weather-info');
  const city_elem = document.createElement('div');
  const temp_elem = document.createElement('div');
  const desc_elem = document.createElement('div');
  const details_elem = document.createElement('ul');

  city_elem.classList.add('city');
  temp_elem.classList.add('temp');
  desc_elem.classList.add('desc');
  details_elem.classList.add('details');

  city_elem.textContent = `${info.city}, ${info.country}`;
  temp_elem.textContent = formatTemperature(info.temp);
  desc_elem.textContent = upperFirstLetter(info.desc);

  details_elem.append(
    createDetailsItem('Feels like', formatTemperature(info.feels_like)),
    createDetailsItem('Visibility', formatVisibility(info.visibility)),
    createDetailsItem('Humidity', `${info.humidity}%`),
    createDetailsItem('Pressure', `${info.pressure}hPa`),
    createDetailsItem('Wind speed', formatWindSpeed(info.wind_speed)),
    createDetailsItem('Wind direction', formatWindDirection(info.wind_dir)),
    createDetailsItem('Sunrise', formatTime(info.sunrise, info.timezone)),
    createDetailsItem('Sunset', formatTime(info.sunset, info.timezone))
  );

  container.innerHTML = '';
  container.append(city_elem, temp_elem, desc_elem, details_elem);
}

function createDetailsItem(name, value) {
  const item_elem = document.createElement('li');
  const name_elem = document.createElement('span');
  const value_elem = document.createElement('span');

  item_elem.classList.add('details-item');
  name_elem.classList.add('details-item-name');
  value_elem.classList.add('details-item-value');

  name_elem.textContent = name;
  value_elem.textContent = value;
  item_elem.append(name_elem, value_elem);

  return item_elem;
}

function formatTemperature(value) {
  value = Math.floor(value);
  if (degree_unit === 'celsius') {
    return Math.round(value - 273.15) + '°C';
  } else if (degree_unit === 'fahrenheit') {
    return Math.round(((value - 273.15) * 9) / 5 + 32) + '°F';
  }
}

function formatVisibility(value) {
  let visibility = Math.round(value / 1000) + 'km';
  if (value >= 10000) {
    visibility = '+' + visibility;
  }
  return visibility;
}

function formatWindSpeed(value) {
  return Math.round(value * 3.502) + 'km/h';
}

function formatWindDirection(value) {
  if (value > 337.5 || value <= 22.5) {
    return 'North';
  } else if (value > 22.5 && value <= 67.5) {
    return 'North-East';
  } else if (value > 67.5 && value <= 112.5) {
    return 'East';
  } else if (value > 112.5 && value <= 157.5) {
    return 'South-East';
  } else if (value > 157.5 && value <= 202.5) {
    return 'South';
  } else if (value > 202.5 && value <= 247.5) {
    return 'South-West';
  } else if (value > 247.5 && value <= 292.5) {
    return 'West';
  } else if (value > 292.5) {
    return 'North-West';
  }
}

function formatTime(dt, tz) {
  let date = new Date(dt * 1000);
  let timezone = tz / 60 / 60;
  date.setHours(date.getUTCHours() + timezone);

  let hours = date.getHours().toString().padStart(2, '0');
  let minutes = date.getMinutes().toString().padStart(2, '0');

  return `${hours}:${minutes}`;
}

function upperFirstLetter(string) {
  return string.slice(0, 1).toUpperCase() + string.slice(1).toLowerCase();
}
