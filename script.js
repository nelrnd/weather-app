const searchForm = document.getElementById('search-city-weather');
const cityNameInput = document.getElementById('city-name');

searchForm.onsubmit = (e) => {
  e.preventDefault();

  const cityName = cityNameInput.value;

  if (cityName) {
    const weatherInfo = getWeatherInfo(cityName);
    weatherInfo.then((info) => console.log(info));
    cityNameInput.value = '';
  }
};

async function getWeatherData(cityName) {
  try {
    const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather?';
    const API_KEY = 'f18ef5d5f0e1ffb4959bcbf4a5704d2d';

    const response = await fetch(`${BASE_URL}q=${cityName}&appid=${API_KEY}`, {
      mode: 'cors',
    });

    const data = await response.json();

    console.log(data.weather);

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (err) {
    console.error(err);
  }
}

async function getWeatherInfo(cityName) {
  const data = await getWeatherData(cityName);

  const weatherInfo = {
    cityName: data.name,
    temp: data.main.temp,
    weather: data.weather[0].main,
    desc: data.weather[0].description,
  };

  return weatherInfo;
}
