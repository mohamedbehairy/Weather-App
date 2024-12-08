const cards = document.getElementById("cards");
const searchInp = document.getElementById("searchInp");
const weatherAlert = document.getElementById("weatherAlert");

// Fetch Weather Data from API
async function getWeather(location) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=bacc653bd42342e2a37155053240911&q=${location}&days=3`
    );

    if (response.status !== 200) throw new Error("Failed to fetch weather data.");

    const result = await response.json();
    displayWeather(result);
    weatherAlert.classList.add("d-none"); // Hide alert on success
    cards.classList.remove("d-none"); // Show cards on success
    searchInp.value = ""; // Clear input after search
  } catch (error) {
    console.error("Error fetching weather:", error);
    weatherAlert.classList.remove("d-none"); // Show alert on error
    cards.classList.add("d-none"); // Hide cards on error
  }
}

// Handle Geolocation Success
function success(position) {
  const location = `${position.coords.latitude},${position.coords.longitude}`;
  getWeather(location);
}

// Display Weather Cards
function displayWeather(result) {
  const days = result.forecast.forecastday;
  let cardContent = "";
  const now = new Date();

  for (let [index, day] of days.entries()) {
    const date = new Date(day.date);
    cardContent += `
      <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
        <div class="card">
          <div class="card-header bg-transparent d-flex justify-content-between text-white">
            <div class="day">${date.toLocaleDateString("en-us", {
              weekday: "long",
            })}</div>
            <div class="date">${date.getDate()} ${date.toLocaleDateString(
      "en-us",
      { month: "short" }
    )}</div>
          </div>
          <div class="card-body text-white py-2">
            <div class="location">${result.location.name}</div>
            <h5 class="card-title degree">${
              day.hour[now.getHours()].temp_c
            }°C</h5>
            <img src="${"https:" + day.day.condition.icon}" width="120" alt="${
      day.day.condition.text
    }">
            <div class="card-text">${day.day.condition.text}</div>
            <div class="weather-details mb-2">
              <span><img src="imgs/icon-umberella.png" alt=""> ${
                day.hour[now.getHours()].humidity
              }%</span>
              <span><img src="imgs/icon-wind.png" class="degree" alt="18 km/h"> ${
                day.hour[now.getHours()].wind_kph
              } km/h </span>
              <span><img src="imgs/icon-compass.png" alt="East"> ${
                day.hour[now.getHours()].wind_dir
              } </span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  cards.innerHTML = cardContent;
}

// On Load - Fetch Weather by Geolocation
window.addEventListener("load", function () {
  navigator.geolocation.getCurrentPosition(success, (error) => {
    console.error("Geolocation error:", error);
    alert("Geolocation failed. Please search manually.");
  });
});

// On Search Input Key Press
searchInp.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    getWeather(this.value);
  }
});
