import {
  formatTemperature,
  formatVisibility,
  formatWindSpeed,
  formatWindDirection,
  formatTime,
  upperFirstLetter,
  matchIcon,
} from './utils.js';

const searchForm = document.getElementById('search-form');
const tempSwitchElem = document.getElementById('temp-switch');

export let degreeUnit = 'celsius';

async function fetchCurrentWeather(location) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=f18ef5d5f0e1ffb4959bcbf4a5704d2d`,
    { mode: 'cors' }
  );
  const data = await response.json();
  return data;
}

async function fetchWeatherForecast(location) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=f18ef5d5f0e1ffb4959bcbf4a5704d2d`,
    { mode: 'cors' }
  );
  const data = await response.json();
  return data;
}

function processWeatherData(current, forecast) {
  const info = {};

  // current weather info
  info.city = current.name;
  info.country = current.sys.country;
  info.desc = current.weather[0].description;
  info.temp = current.main.temp;
  info.feels_like = current.main.feels_like;
  info.visibility = current.visibility;
  info.humidity = current.main.humidity;
  info.pressure = current.main.pressure;
  info.wind_speed = current.wind.speed;
  info.wind_dir = current.wind.deg;
  info.sunrise = current.sys.sunrise;
  info.sunset = current.sys.sunset;
  info.timezone = current.timezone;

  // weather forecast info
  info.forecast = [];
  for (const prop of forecast.list) {
    const item = {};

    item.time = prop.dt;
    item.temp = prop.main.temp;
    item.icon = matchIcon(prop.weather[0].icon);

    info.forecast.push(item);
  }

  return info;
}

function displayWeatherInfo(info, isNewSearch) {
  const container = document.getElementById('weather-info');
  const cityElem = document.createElement('div');
  const tempElem = document.createElement('div');
  const descElem = document.createElement('div');
  const detailsList = document.createElement('ul');
  const forecastList = document.createElement('ul');

  cityElem.className = 'city';
  tempElem.className = 'temp';
  detailsList.className = 'details-list';
  forecastList.className = 'forecast-list';

  cityElem.textContent = `${info.city}, ${info.country}`;
  tempElem.textContent = formatTemperature(info.temp);
  descElem.textContent = upperFirstLetter(info.desc);

  // Make temperature element reactive to degree unit switch
  degreeModule.addElem(tempElem, info.temp);

  // Create suble appear animation
  if (isNewSearch) {
    container.className = 'appear';
    // Remove animation class when animation finished
    setTimeout(() => (container.className = ''), 400);
  }

  detailsList.append(
    createDetailsItem('Feels like', formatTemperature(info.feels_like)),
    createDetailsItem('Visibility', formatVisibility(info.visibility)),
    createDetailsItem('Humidity', `${info.humidity}%`),
    createDetailsItem('Pressure', `${info.pressure}hPa`),
    createDetailsItem('Wind speed', formatWindSpeed(info.wind_speed)),
    createDetailsItem('Wind direction', formatWindDirection(info.wind_dir)),
    createDetailsItem('Sunrise', formatTime(info.sunrise, info.timezone)),
    createDetailsItem('Sunset', formatTime(info.sunset, info.timezone))
  );

  degreeModule.addElem(
    detailsList.firstElementChild.lastElementChild,
    info.feels_like
  );

  for (const prop of info.forecast) {
    const item = document.createElement('li');
    const timeElem = document.createElement('span');
    const tempElem = document.createElement('span');
    const iconElem = document.createElement('img');

    item.className = 'forecast-item';
    timeElem.className = 'forecast-item-time';

    timeElem.textContent = formatTime(prop.time, info.timezone);
    tempElem.textContent = formatTemperature(prop.temp);
    iconElem.src = `/assets/icons/${prop.icon}.svg`;
    iconElem.alt = prop.icon.toString();

    degreeModule.addElem(tempElem, prop.temp);

    item.append(timeElem, iconElem, tempElem);

    forecastList.appendChild(item);
  }

  // Make forecast list scrollable by mouse drag

  const scrollPos = { start: null, new: null };
  forecastList.onmousedown = (event) => {
    if (event.button === 0) {
      scrollPos.start = event.clientX;
      window.onmousemove = scrollElem;
      window.onmouseup = () => {
        document.body.classList.remove('grabbing');
        forecastList.classList.remove('grabbing');
      };

      document.body.classList.add('grabbing');
      forecastList.classList.add('grabbing');
    }
  };

  function scrollElem(event) {
    if (event.buttons === 0) {
      window.onmousemove = null;
    } else {
      scrollPos.new = scrollPos.start - event.clientX;
      forecastList.scrollLeft += scrollPos.new;
      scrollPos.start = event.clientX;
    }
  }

  container.innerHTML = null;
  container.append(cityElem, tempElem, descElem, detailsList, forecastList);
}

function createDetailsItem(name, value) {
  const item = document.createElement('li');
  const nameElem = document.createElement('span');
  const valueElem = document.createElement('span');

  item.className = 'details-item';
  nameElem.className = 'details-item-name';
  valueElem.className = 'details-item-value';

  nameElem.textContent = name;
  valueElem.textContent = value;

  item.append(nameElem, valueElem);

  return item;
}

async function makeSearch(location) {
  try {
    const data = await Promise.all([
      fetchCurrentWeather(location),
      fetchWeatherForecast(location),
    ]);

    if (data[0].cod === '404') {
      throw new Error('Could not find specified city');
    }

    const info = processWeatherData(data[0], data[1]);

    displayWeatherInfo(info, true);
  } catch (err) {
    displayError(err.message);
  }
}

function displayError(msg) {
  const container = document.querySelector('.errors-container');
  const errElem = document.createElement('div');
  const errText = document.createElement('span');
  const closeBtn = document.createElement('button');

  errElem.classList.add('error', 'new-error');
  closeBtn.className = 'error-close-btn';

  errText.textContent = msg;

  const removeAfter3s = setTimeout(removeError.bind(errElem), 3000);

  closeBtn.onclick = () => {
    clearTimeout(removeAfter3s);
    removeError.call(errElem);
  };

  errElem.append(errText, closeBtn);
  container.appendChild(errElem);
}

function removeError() {
  this.classList.add('bye-error');
  setTimeout(() => this.remove(), 300);
}

const degreeModule = (function () {
  let degreeElems = [];

  function switchDegreeUnit() {
    if (degreeUnit === 'celsius') {
      degreeUnit = 'fahrenheit';
    } else if (degreeUnit === 'fahrenheit') {
      degreeUnit = 'celsius';
    }
  }

  function addElem(elem, value) {
    degreeElems.push({ elem, value });
  }

  function clearElems() {
    degreeElems = [];
  }

  function switchDegreeElemsText() {
    console.log(degreeUnit);
    console.log(degreeElems);
    degreeElems.forEach((elem) => {
      elem.elem.textContent = formatTemperature(elem.value);
    });
  }

  return {
    switchDegreeUnit,
    addElem,
    clearElems,
    switchDegreeElemsText,
  };
})();

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const searchInput = document.getElementById('search-input');
  const location = searchInput.value.trim();

  searchInput.blur();

  degreeModule.clearElems;

  if (location) {
    makeSearch(location);
  }

  searchInput.value = '';
});

tempSwitchElem.addEventListener('change', () => {
  degreeModule.switchDegreeUnit();
  degreeModule.switchDegreeElemsText();
});

makeSearch('paris');
