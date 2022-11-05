const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('location-search-input');
const tempSwitch = document.getElementById('temp-switch');

let weatherInfo = null;
let forecastInfo = null;
let degree_unit = 'celsius';

searchForm.onsubmit = handleSearch;
tempSwitch.onchange = handleTempSwitch;

function handleSearch(e) {
  e.preventDefault();

  let location = searchInput.value;
  location = location.trim();
  if (!location) return;

  makeSearch(location);

  // Clear input after search
  searchInput.value = '';
}

async function makeSearch(location) {
  try {
    const weatherData = await getWeatherData(location);
    const forecastData = await getForecastData(location);
    if (weatherData.cod === '404') {
      throw new Error('Could not find specified city');
    }
    weatherInfo = getWeatherInfo(weatherData);
    forecastInfo = getForecastInfo(forecastData);
    displayWeatherInfo(weatherInfo, true);
    displayForecastInfo(forecastInfo, true);
  } catch (err) {
    displayError(err.message);
  }
}

async function getWeatherData(location) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=f18ef5d5f0e1ffb4959bcbf4a5704d2d`,
    {
      mode: 'cors',
    }
  );

  const data = await response.json();

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
    displayForecastInfo(forecastInfo);
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

function displayWeatherInfo(info, newCity) {
  const container = document.getElementById('weather-info');
  const city_elem = document.createElement('div');
  const temp_elem = document.createElement('div');
  const desc_elem = document.createElement('div');
  const details_elem = document.createElement('ul');

  city_elem.classList.add('city');
  temp_elem.classList.add('temp');
  desc_elem.classList.add('desc');
  details_elem.classList.add('details');

  if (newCity) {
    container.classList.add('appear');
    setTimeout(() => container.classList.remove('appear'), 400);
  }

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

function getWeatherIcon(code) {
  let icon = '';

  switch (code) {
    case '01d':
      icon = 'sun';
      break;
    case '01n':
      icon = 'moon';
      break;
    case '02d':
      icon = 'cloud-sun';
      break;
    case '02n':
      icon = 'cloud-moon';
      break;
    case '03d':
    case '03n':
    case '04d':
    case '04n':
      icon = 'cloud';
      break;
    case '09d':
    case '09n':
    case '10d':
    case '10n':
      icon = 'rain';
      break;
    case '11d':
    case '11n':
      icon = 'thunder';
      break;
    case '13d':
    case '13n':
      icon = 'snow';
      break;
    case '50d':
    case '50n':
      icon = 'mist';
      break;
    default:
      break;
  }

  return icon;
}

function displayError(msg) {
  const err_container = document.querySelector('.error-container');
  const err_elem = document.createElement('div');
  const err_text = document.createElement('span');
  const close_btn = document.createElement('button');

  err_elem.classList.add('error', 'new-error');
  close_btn.className = 'error-close-btn';

  err_text.textContent = msg;

  close_btn.onclick = () => {
    clearTimeout(remove);
    removeError.call(err_elem);
  };

  err_elem.append(err_text, close_btn);
  err_container.appendChild(err_elem);

  const remove = setTimeout(removeError.bind(err_elem), 3000);
}

function removeError() {
  this.classList.add('bye-error');
  setTimeout(() => this.remove(), 300);
}

// Demo purpose

makeSearch('paris');

async function getForecastData(location) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=f18ef5d5f0e1ffb4959bcbf4a5704d2d`,
    {
      mode: 'cors',
    }
  );

  const data = await response.json();

  getForecastInfo(data);

  return data;
}

function getForecastInfo(data) {
  const info = [];

  for (item of data.list) {
    const obj = {};

    obj.time = item.dt_txt.split(' ')[1].slice(0, -3);
    obj.icon = getWeatherIcon(item.weather[0].icon);
    obj.temp = item.main.temp;

    info.push(obj);
  }

  console.log(info);

  return info;
}

function displayForecastInfo(info) {
  const info_elem = document.querySelector('#weather-info');
  const container = document.createElement('div');
  container.className = 'forecast-section';

  let first = true;

  for (item of info) {
    const elem = document.createElement('div');
    const time_elem = document.createElement('span');
    const icon_elem = document.createElement('img');
    const temp_elem = document.createElement('span');

    elem.className = 'forecast-card';

    time_elem.textContent = first ? 'now' : item.time;
    first = false;
    icon_elem.src = `/assets/icons/${item.icon}.svg`;
    icon_elem.alt = item.icon;
    temp_elem.textContent = formatTemperature(item.temp);

    elem.append(time_elem, icon_elem, temp_elem);

    container.appendChild(elem);
  }

  const scrollPos = { start: null, new: null };

  container.addEventListener('mousedown', (event) => {
    if (event.button === 0) {
      scrollPos.start = event.clientX;
      window.addEventListener('mousemove', scrollElem);
    }
  });

  function scrollElem(event) {
    if (event.buttons === 0) {
      window.removeEventListener('mousemove', scrollElem);
    } else {
      scrollPos.new = scrollPos.start - event.clientX;
      container.scrollLeft += scrollPos.new;
      scrollPos.start = event.clientX;
    }
  }

  info_elem.appendChild(container);
}

getForecastData('paris');
