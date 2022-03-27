var cities = [];
var cityForm = document.querySelector("#city-search-form");
var cityInput = document.querySelector("#city");
var weatherContainer = document.querySelector("#current-weather-container");
var citySearchInput = document.querySelector("#searched-city");
var forecastTitle = document.querySelector("#forecast");
var forecastContainer = document.querySelector("#fiveday-container");
var pastSearchButton = document.querySelector("#past-search-buttons");

var formSumbitHandler = function (event) {
  event.preventDefault();
  var city = cityInput.value.trim();
  if (city) {
    getCityWeather(city);
    get5Day(city);
    cities.unshift({ city });
    cityInput.value = "";
  } else {
    alert("Please enter a City");
  }
  saveSearch();
  pastSearch(city);
};

var saveSearch = function () {
  localStorage.setItem("cities", JSON.stringify(cities));
};

var getCityWeather = function (city) {
  var apiKey = "740bd3e646fe8c9d3def21a3fe5995f4";
  var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

  fetch(apiURL).then(function (response) {
    response.json().then(function (data) {
      displayWeather(data, city);
    });
  });
};

var displayWeather = function (weather, searchCity) {
  //clear old content
  weatherContainer.textContent = "";
  citySearchInput.textContent = searchCity;


  //create date element
  var currentDate = document.createElement("span");
  currentDate.textContent =
    " (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
  citySearchInput.appendChild(currentDate);

  //create an image element
  var weatherIcon = document.createElement("img");
  weatherIcon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
  );
  citySearchInput.appendChild(weatherIcon);

  //create a span element to hold temperature data
  var temperature = document.createElement("span");
  temperature.textContent = "Temperature: " + weather.main.temp + " °F";
  temperature.classList = "list-group-item";

  //create a span element to hold Humidity data
  var humidity = document.createElement("span");
  humidity.textContent = "Humidity: " + weather.main.humidity + " %";
  humidity.classList = "list-group-item";

  //create a span element to hold Wind data
  var windSpeed = document.createElement("span");
  windSpeed.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
  windSpeed.classList = "list-group-item";

  //append to container
  weatherContainer.appendChild(temperature);

  //append to container
  weatherContainer.appendChild(humidity);

  //append to container
  weatherContainer.appendChild(windSpeed);

  var lat = weather.coord.lat;
  var lon = weather.coord.lon;
  getUvIndex(lat, lon);
};

var getUvIndex = function (lat, lon) {
  var apiKey = "740bd3e646fe8c9d3def21a3fe5995f4";
  var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`;
  fetch(apiURL).then(function (response) {
    response.json().then(function (data) {
      displayUvIndex(data);
      console.log(data);
    });
  });

};

var displayUvIndex = function (index) {
  var uvIndex = document.createElement("div");
  uvIndex.textContent = "UV Index: ";
  uvIndex.classList = "list-group-item";

  uvIndexValue = document.createElement("span");
  uvIndexValue.textContent = index.value;

  if (index.value <= 2) {
    uvIndexValue.classList = "lovely";
  } else if (index.value > 2 && index.value <= 8) {
    uvIndexValue.classList = "middle ";
  } else if (index.value > 8) {
    uvIndexValue.classList = "warning";
  }

  uvIndex.appendChild(uvIndexValue);

  //append index to current weather
  weatherContainer.appendChild(uvIndex);
};

var get5Day = function (city) {
  var apiKey = "740bd3e646fe8c9d3def21a3fe5995f4";
  var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

    fetch(apiURL).then(function (response) {
      response.json().then(function (data) {
        display5Day(data);
      });
    });
  };
  
  var display5Day = function (weather) {
    forecastContainer.textContent = "";
    forecastTitle.textContent = "5-Day Forecast:";
  
    var forecast = weather.list;
  for (var i = 5; i < forecast.length; i = i + 8) {
    var dailyForecast = forecast[i];

    var forecastEl = document.createElement("div");
    forecastEl.classList = "card bg-primary text-light m-2";
  

    //create date element
    var forecastDate = document.createElement("h5");
    forecastDate.textContent = moment
      .unix(dailyForecast.dt)
      .format("MMM D, YYYY");
    forecastDate.classList = "card-header text-center";
    forecastEl.appendChild(forecastDate);

    //create an image element
    var weatherIcon = document.createElement("img");
    weatherIcon.classList = "card-body text-center";
    weatherIcon.setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`
    );

    //append to forecast card
    forecastEl.appendChild(weatherIcon);

    //create temperature span
    var forecastTemp = document.createElement("span");
    forecastTemp.classList = "card-body text-center";
    forecastTemp.textContent = dailyForecast.main.temp + " °F";

    //append to forecast card
    forecastEl.appendChild(forecastTemp);

    var forecastHum = document.createElement("span");
    forecastHum.classList = "card-body text-center";
    forecastHumtextContent = dailyForecast.main.humidity + "  %";

    //append to forecast card
    forecastEl.appendChild(forecastHum);

    //append to five day container
    forecastContainer.appendChild(forecast);
    
  }
};

var pastSearch = function (pastSearch) {
 

  pastSearch1 = document.createElement("button");
  pastSearch.textContent = pastSearch;
  pastSearchclassList = "d-flex w-100 btn-light border p-2";
  pastSearch1.setAttribute("data-city", pastSearch);
  pastSearch1.setAttribute("type", "submit");

  pastSearchButton.prepend(pastSearch);
};

var pastSearchHandler = function (event) {
  var city = event.target.getAttribute("data-city");
  if (city) {
    getCityWeather(city);
    get5Day(city);
  }
};

// pastSearch();

cityForm.addEventListener("submit", formSumbitHandler);
pastSearchButton.addEventListener("click", pastSearchHandler);