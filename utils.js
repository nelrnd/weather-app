import { degreeUnit } from './script.js';

function formatTemperature(value) {
  value = Math.floor(value);
  if (degreeUnit === 'celsius') {
    return Math.round(value - 273.15) + '°C';
  } else if (degreeUnit === 'fahrenheit') {
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

function matchIcon(id) {
  let icon = '';

  switch (id) {
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

export {
  formatTemperature,
  formatVisibility,
  formatWindSpeed,
  formatWindDirection,
  formatTime,
  upperFirstLetter,
  matchIcon,
};
