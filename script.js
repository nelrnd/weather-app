async function getWeatherData(cityName) {
  const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather?';
  const API_KEY = 'f18ef5d5f0e1ffb4959bcbf4a5704d2d';

  const response = await fetch(`${BASE_URL}q=${cityName}&appid=${API_KEY}`, {
    mode: 'cors',
  });

  const data = await response.json();

  return data;
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

const weatherInfo = getWeatherInfo('Tokyo');
weatherInfo.then((info) => console.log(info));
