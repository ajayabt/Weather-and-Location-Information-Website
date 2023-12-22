// 1. Map is loaded
   // the paramaters we'll need: where it shows initialy, 
   // output lon and lat on click pass to geonames
   // use geonames API to search wikipedia for nearby locations
   // wikipedia will need to return image, information and name
   // Name passed to weather API, call the weather
   
//google maps set up
function initMap() {
    //opening map view
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 53.5, lng: 2.4 },
        zoom: 8,
    });
//event listener for click to output lat and lon
    map.addListener('click', function(event) {
        var latLng = event.latLng;
        console.log('Latitude: ' + latLng.lat() + ', Longitude: ' + latLng.lng());
        //calling the functions defined later within the event listener,
        fetchNearbyWikipediaEntries(latLng.lat(), latLng.lng(), 'ajayabt', handleWikiData);
    
        fetchAndDisplayWeather(latLng.lat(), latLng.lng());  // Fetch weather data based on lat and lng, see paramaters for function
    });
}
//callback function due to asynchronicity, converts the lat and lon into a title name for wiki
function fetchNearbyWikipediaEntries(latitude, longitude, username, callback) {
    const geonamesQueryUrl = `http://api.geonames.org/findNearbyWikipediaJSON?lat=${latitude}&lng=${longitude}&username=${username}`;

    fetch(geonamesQueryUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
  
        .then(data => {
            if (data.geonames && data.geonames.length > 0) {
                let nameForWikiApi = data.geonames[0].title;
                callback(nameForWikiApi, latitude, longitude); 
            } else {
                console.log('No nearby Wikipedia entries found.');
            }
        })
        .catch(e => {
            console.error('Error fetching data: ', e);
        });
}
//callback function so that the title can be accessed by wikipedia.
function handleWikiData(title, latitude, longitude) {
    console.log("Received Title:", title);
    fetchWikipediaData(title);  // Fetch Wikipedia data based on title
}
//wiki API logic
function fetchWikipediaData(title) {
    const wikipediaApiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts|pageimages&titles=${encodeURIComponent(title)}&pithumbsize=100&origin=*`;

    fetch(wikipediaApiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // wiki processing with Object.key as it needs to be dynamically generated=> not really sure on this bit!
            if (data.query && data.query.pages) {
                const pageId = Object.keys(data.query.pages)[0]; 
                const pageData = data.query.pages[pageId];

                const extract = pageData.extract || "No extract available";
                const imageUrl = pageData.thumbnail ? pageData.thumbnail.source : "";
                
                displayWikipediaData(extract, imageUrl);
            }
        })
        .catch(e => {
            console.error('Error fetching Wikipedia data: ', e);
        });
        }
//basic display funtion for the wiki content, function called above in the fetchWikipediaData block
        function displayWikipediaData(extract, imageUrl) {

            console.log(extract)
            
            $('#wikipedia-content').html(extract);
        
            
            if (imageUrl) {
                $('#wikipedia-image').attr('src', imageUrl);
            }
        }
//Fetch weather API
function fetchAndDisplayWeather(latitude, longitude) {
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=1a06838aa0ec5de32fa5b9b5de0234e2&units=metric`;

    fetch(weatherApiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(forecastData => {
            displayWeather(forecastData);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}


//straight forward display weather function

function displayWeather(forecastData) {
    let weatherIcon = forecastData.weather[0].icon;
    let nameDisplay = $('<h2>').text(forecastData.name);
    let iconDisplay = $('<img>').attr('src', 'https://openweathermap.org/img/w/' + weatherIcon + '.png');
    let dateAndTime = $('<h2>').text('Current date: ' + dayjs().format('DD-MM-YYYY'));
    let tempDisplay = $('<h2>').text('Current temperature: ' + forecastData.main.temp.toFixed(1) + ' \u00B0C');
    let humidityDisplay = $('<h2>').text('Humidity: ' + forecastData.main.humidity.toFixed(1) + '%');
    let windSpeedDisplay = $('<h2>').text('Wind speed: ' + forecastData.wind.speed.toFixed(1) + ' mph');

    let currentWeatherContainer = $('#today');
    currentWeatherContainer.empty();
    currentWeatherContainer.append(nameDisplay, iconDisplay, dateAndTime, tempDisplay, humidityDisplay, windSpeedDisplay);
}

//favourites button something like...

//$(favButton).on(click, function)=> 
// const favourites = [];
// favourites.push[nameForWikiUrl];
// localStorage.setItem('favourites', JSON.stringify(favourites))
// 
//Generate favourites cards function
//JSON.parse(localStorage.getItem(favourites))
// for each function to generate cards...
// for each favourite => 

// favouritesCard = $(cardElement)
// favouritesCardTitle = $(<h2>).text(i)
// favouritesCardImage =$(<img src ="img source from wikipedia API variable")

//on click of card fetchAndDisplay information for card...so API chain is one function
 























// document.addEventListener('DOMContentLoaded', function () {
//     const locations = document.querySelectorAll('.location');
//     const weatherInfo = document.getElementById('weatherInfo');
//     const apiKey = '6aa4598f48a0810a039e7c4a993d88c4'; 
//     const apiEndpoint = 'https://api.openweathermap.org/data/2.5/forecast';

//     locations.forEach(location => {
//         location.addEventListener('click', function () {
//             const locationName = this.getAttribute('data-location');
//             getWeatherInfo(locationName);
//         });
//     });

//     function getWeatherInfo(locationName) {
//         const apiUrl = `${apiEndpoint}?q=${locationName}&appid=${apiKey}`;

//         // https://api.openweathermap.org/data/2.5/forecast?q=london&appid=6aa4598f48a0810a039e7c4a993d88c4

//         fetch(apiUrl)
//             .then(function (response) {
//                 return response.json();

//             })
//             .then(function (data) {
                
//                 const temperature = data.list[0].main.temp;
//                 const description = data.list[0].weather[0].description;
//                 weatherInfo.innerHTML = `<h2>${locationName}</h2>
//                                          <p>Temperature: ${temperature}°C</p>;
//                                          <p>Weather: ${description}</p>`;
//                                          console.log(temperature, description)
//             })

//     }
// });

// getWeatherInfo()

