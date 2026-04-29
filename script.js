const apiKey = "YOUR_API_KEY_HERE";


function getWeather() {
    let city = document.getElementById("city").value;
    function getWeather() {
    const city = document.getElementById("city").value.trim();

    if (!city) {
        alert("Enter a city");
        return;
    }

    fetchWeather(city);
}
}


function fetchWeather(city) {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
  .then(response => {
      if (!response.ok) {
          throw new Error("City not found");
      }
      return response.json();
  })
  .then(data => {
      updateUI(data);
      fetchForecast(data.coord.lat, data.coord.lon);
  })
  .catch(() => {
      document.getElementById("weather-result").innerHTML =
          `<p class="error-message">City not found! Try again.</p>`;
  });
}


function fetchForecast(lat, lon) {
    let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => updateForecastUI(data))
        .catch(error => console.log("Error fetching forecast:", error));
}


function updateUI(data) {
    let weatherIcon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    document.getElementById("weather-result").innerHTML = `
        <div class="weather-card">
            <h2>${data.name}, ${data.sys.country}</h2>
            <img src="${weatherIcon}" alt="Weather Icon">
            <h3>${data.main.temp}°C</h3>
            <p>${data.weather[0].description}</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
        </div>
        <div class="forecast-container">
            <h3 class="forecast-title">Hourly Forecast</h3>
            <div id="hourly-forecast"></div>
        </div>
        <div class="forecast-container">
            <h3 class="forecast-title">7-Day Forecast</h3>
            <div id="weekly-forecast"></div>
        </div>
    `;
}


function updateForecastUI(data) {
    let hourlyHTML = "";
    let weeklyData = {};

  
    for (let i = 0; i < 6; i++) {
        let entry = data.list[i];
        let time = new Date(entry.dt * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        hourlyHTML += `
            <div class="hourly-item">
                <p>${time}</p>
                <img src="https://openweathermap.org/img/wn/${entry.weather[0].icon}.png" alt="Icon">
                <p>${entry.main.temp}°C</p>
            </div>
        `;
    }

   
    data.list.forEach(entry => {

        let date = new Date(entry.dt * 1000).toLocaleDateString();
        if (!weeklyData[date]) {
            weeklyData[date] = {
                min: entry.main.temp_min,
                max: entry.main.temp_max,
                icon: entry.weather[0].icon
            };
        } else {
            weeklyData[date].min = Math.min(weeklyData[date].min, entry.main.temp_min);
            weeklyData[date].max = Math.max(weeklyData[date].max, entry.main.temp_max);
        }
    });

    let weeklyHTML = "";
    for (let date in weeklyData) {
        weeklyHTML += `
            <div class="weekly-item">
                <p>${date}</p>
                <img src="https://openweathermap.org/img/wn/${weeklyData[date].icon}.png" alt="Icon">
                <p>${weeklyData[date].min}°C - ${weeklyData[date].max}°C</p>
            </div>
        `;
    }

    document.getElementById("hourly-forecast").innerHTML = hourlyHTML;
    document.getElementById("weekly-forecast").innerHTML = weeklyHTML;
    document.getElementById("weather-result").innerHTML = "Loading...";
}
