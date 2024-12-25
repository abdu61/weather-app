import "./styles.css";
import clearDay from "./assets/sun.png";
import clearNight from "./assets/clearNight.png";
import rain from "./assets/rain.png";
import snow from "./assets/snow.png";
import sleet from "./assets/sleet.png";
import wind from "./assets/wind.png";
import fog from "./assets/fog.png";
import cloudy from "./assets/cloudy.png";
import partlyCloudyDay from "./assets/cloudy-day.png";
import partlyCloudyNight from "./assets/cloudy-night.png";
import hail from "./assets/hail.png";
import thunderstorm from "./assets/thunderstorm.png";
import tornado from "./assets/tornado.png";
import feelsLike from "./assets/feelsLike.png";
import humidity from "./assets/humidity.png";
import windSpeed from "./assets/windSpeed.png";
import cloudCover from "./assets/cloudCover.png";
import visibility from "./assets/visibility.png";
import uvIndex from "./assets/uv.png";


const apiKey = process.env.API_KEY;
let currentUnit = 'metric';

const iconMap = {
  'clear-day': clearDay,
  'clear-night': clearNight,
  'rain': rain,
  'snow': snow,
  'sleet': sleet,
  'wind': wind,
  'fog': fog,
  'cloudy': cloudy,
  'partly-cloudy-day': partlyCloudyDay,
  'partly-cloudy-night': partlyCloudyNight,
  'hail': hail,
  'thunderstorm': thunderstorm,
  'tornado': tornado,
};

function getWeather(location) {
  fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=${currentUnit}&key=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      displayCurrent(data.currentConditions, data.resolvedAddress);
      displayForecast(data.days);
    })
    .catch(() => {
      // Handle error
    });
}

function displayCurrent(current, place) {
  const currentDiv = document.getElementById('current-weather');
  const iconSrc = iconMap[current.icon] || 'default.png';
  
  // Determine UV Index description
  let uvDescription = '';
  const uv = current.uvindex;
  if (uv <= 2) {
    uvDescription = 'Low';
  } else if (uv <= 5) {
    uvDescription = 'Moderate';
  } else if (uv <= 7) {
    uvDescription = 'High';
  } else if (uv <= 10) {
    uvDescription = 'Very High';
  } else {
    uvDescription = 'Extreme';
  }

  currentDiv.innerHTML = `
    <div class="current-container">
      <div class="current-left">
        <div class="current-left-headings">
        <h2>Current Weather</h2>
        <p>Location: ${place}</p>
        </div>
        <div class="temp-icon">
          <img src="${iconSrc}" alt="${current.icon}" />
          <p class="temperature">${current.temp}°</p>
        </div>
        <div class="current-left-footer">
        <p>${current.conditions}</p>
        </div>
      </div>
      <div class="current-right">
        <div class="weather-detail">
          <img src="${feelsLike}" alt="Feels Like" />
          <p>Feels Like</p>
          <p><b>${current.feelslike}°</b></p>
        </div>
        <div class="weather-detail">
          <img src="${humidity}" alt="Humidity" />
          <p>Humidity</p> 
          <p><b>${current.humidity}%</b></p>
        </div>
        <div class="weather-detail">
          <img src="${windSpeed}" alt="Wind Speed" />
          <p>Wind Speed</p>
          <p><b>${current.windspeed} km/h</b></p>
        </div>
        <div class="weather-detail">
          <img src="${cloudCover}" alt="Cloud Cover" />
          <p>Cloud Cover</p>
          <p><b>${current.cloudcover}%</b></p>
        </div>
        <div class="weather-detail">
          <img src="${visibility}" alt="Visibility" />
          <p>Visibility</p> 
          <p><b>${current.visibility} km</b></p>
        </div>
        <div class="weather-detail">
          <img src="${uvIndex}" alt="UV Index" />
          <p>UV Index</p>
          <p><b>${uvDescription}</b></p>
        </div>
      </div>
    </div>
  `;
}

function displayForecast(days) {
  const forecastDiv = document.getElementById('forecast');
  forecastDiv.innerHTML = '';
  const nextSevenDays = days.slice(0, 8);
  const today = new Date();

  nextSevenDays.forEach((day, index) => {
    const dayItem = document.createElement('div');

    // Determine the day label
    let dayLabel = '';
    if (index === 0) {
      dayLabel = 'Today';
    } else if (index === 1) {
      dayLabel = 'Tomorrow';
    } else {
      const date = new Date(day.datetime);
      dayLabel = date.toLocaleDateString('en-US', { weekday: 'long' });
    }

    // Format the date as MM/DD
    const dateObj = new Date(day.datetime);
    const formattedDate = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;

    const iconSrc = iconMap[day.icon] || 'default.png';
    dayItem.innerHTML = `
      <h3>${dayLabel}</h3>
      <p>${formattedDate}</p>
      <img src="${iconSrc}" alt="${day.icon}" />
      <p>${day.conditions}</p>
      <p>${Math.round(day.tempmax)}° / ${Math.round(day.tempmin)}°</p>
    `;
    forecastDiv.appendChild(dayItem);
  });
}

function init() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        getWeather(`${pos.coords.latitude},${pos.coords.longitude}`);
      },
      () => { getWeather('Dubai'); }
    );
  } else {
    getWeather('Dubai');
  }
}

const form = document.getElementById('search-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const query = document.getElementById('search-input').value;
  getWeather(query);
});

document.addEventListener('DOMContentLoaded', () => {
  const unitSelect = document.getElementById('unit-select');
  unitSelect.addEventListener('change', (e) => {
    currentUnit = e.target.value;
    // Optionally re-fetch with last known location or default
    getWeather('Dubai');
  });
  init();
});
