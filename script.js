const searchForm = document.getElementById('search-city-weather');
const cityNameInput = document.getElementById('city-name');

const weatherInfoElems = {
  city: document.querySelector('#weather-info .city'),
  temp: document.querySelector('#weather-info .temp'),
  desc: document.querySelector('#weather-info .desc'),
};

searchForm.onsubmit = handleSearchForm;

async function handleSearchForm(e) {
  e.preventDefault();

  const cityName = cityNameInput.value;

  if (cityName) {
    const data = await getWeatherData(cityName);
    const info = getWeatherInfo(data);
    displayWeatherInfo(info);
    cityNameInput.value = '';
  }
}

async function getWeatherData(cityName) {
  try {
    const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather?';
    const API_KEY = 'f18ef5d5f0e1ffb4959bcbf4a5704d2d';
    const url = new URL(encodeURI(`${BASE_URL}q=${cityName}&appid=${API_KEY}`));

    const response = await fetch(url.href, {
      mode: 'cors',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (err) {
    displayError(err);
  }
}

function getWeatherInfo(data) {
  const weatherInfo = {
    cityName: data.name,
    temp: data.main.temp,
    weather: data.weather[0].main,
    desc: data.weather[0].description,
  };

  return weatherInfo;
}

function displayWeatherInfo(info) {
  const { city, temp, desc } = weatherInfoElems;

  city.textContent = info.cityName;
  temp.textContent = info.temp;
  desc.textContent = info.desc;
}

function displayError(msg) {
  const { city, temp, desc } = weatherInfoElems;

  city.textContent = msg;
  temp.textContent = '';
  desc.textContent = '';
}

function convertKelvinToCelcius(temp) {
  return Math.round(Math.round(temp) - 273.15);
}

function convertKelvinToFahrenheit(temp) {
  return Math.round(((Math.round(temp) - 273.15) * 9) / 5 + 32);
}
