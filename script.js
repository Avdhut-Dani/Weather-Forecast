const apiKey = 'your api'; // Replace with your OpenWeatherMap API key
const apiUrl = 'https://api.openweathermap.org/data/2.5/';

document.querySelector('.search-btn').addEventListener('click', () => {
  const city = document.querySelector('.city-input').value;
  if (city) {
    getWeatherByCity(city);
  }
});

document.querySelector('.location-btn').addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      getWeatherByCoordinates(lat, lon);
      console.log(position)
    });
  } else {
    alert('Geolocation is not supported by this browser.');
  }
});

function getWeatherByCity(city) {
  const url = `${apiUrl}weather?q=${city}&units=metric&appid=${apiKey}`;
  fetchWeather(url);
}

function getWeatherByCoordinates(lat, lon) {
  const url = `${apiUrl}weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  fetchWeather(url);
}

function fetchWeather(url) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      displayCurrentWeather(data);
      fetchFiveDayForecast(data.coord.lat, data.coord.lon);
    })
    .catch((error) => {
      console.error('Error fetching weather:', error);
      alert('Unable to fetch weather data.');
    });
}

function displayCurrentWeather(data) {
  const weatherDiv = document.querySelector('.current-weather');
  weatherDiv.querySelector('h2').textContent = `${data.name} (${new Date().toLocaleDateString()})`;
  weatherDiv.querySelector('h4:nth-child(2)').textContent = `Temperature: ${data.main.temp.toFixed(1)}°C`;
  weatherDiv.querySelector('h4:nth-child(3)').textContent = `Wind: ${data.wind.speed} m/s`;
  weatherDiv.querySelector('h4:nth-child(4)').textContent = `Humidity: ${data.main.humidity}%`;
  weatherDiv.querySelector('img').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
  weatherDiv.querySelector('.icon h4').textContent = data.weather[0].description;
}

function fetchFiveDayForecast(lat, lon) {
  const url = `${apiUrl}forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      displayFiveDayForecast(data);
    })
    .catch((error) => {
      console.error('Error fetching forecast:', error);
    });
}

function displayFiveDayForecast(data) {
  const forecastList = document.querySelector('.weather-cards');
  forecastList.innerHTML = ''; // Clear existing forecast

  const forecastDays = data.list.filter((item) => item.dt_txt.includes('12:00:00')); // Get forecast for 12:00 of each day

  forecastDays.forEach((day) => {
    const li = document.createElement('li');
    li.classList.add('card');
    li.innerHTML = `
      <h3>(${new Date(day.dt * 1000).toLocaleDateString()})</h3>
      <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather-icon">
      <h4>Temp: ${day.main.temp.toFixed(1)}°C</h4>
      <h4>Wind: ${day.wind.speed} m/s</h4>
      <h4>Humidity: ${day.main.humidity}%</h4>
    `;
    forecastList.appendChild(li);
  });
}
