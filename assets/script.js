// 1. Map is loaded
   // the paramaters we'll need: where it shows initialy, 
   // output lon and lat on click pass to geonames
   // use geonames API to search wikipedia for nearby locations
   // wikipedia will need to return image, information and name
   // Name passed to weather API, call the weather
   

   function initMap() {
    var  map = new google.maps.Map(document.getElementById('map'), {
          center: { lat: 53.5, lng: 2.4 },
          zoom: 8,
      });
  
  
  map.addListener('click', function (event) {
      var latLng = event.latLng;
      console.log('Latitude: ' + latLng.lat() + ', Longitude: ' + latLng.lng());
  
  });
  
  }

   //geonames API variables
   let latitude = 47; //from googlemaps API
   let longitude = 9;  //from googlemaps API
   let userName = "ajayabt"; //API key


function fetchNearbyWikipediaEntries(latitude, longitude, username) {
    const geonamesQueryUrl = `http://api.geonames.org/findNearbyWikipediaJSON?lat=${latitude}&lng=${longitude}&username=${username}`;

    fetch(geonamesQueryUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
           console.log(data); // Logic here...
          let nameForWikiApi = console.log(data.geonames[0].title)
        })
        .catch(e => {
            console.error('Error fetching data: ', e);
        });
}

// Example usage
fetchNearbyWikipediaEntries(latitude, longitude, userName);

console.log(nameForWikiApi)

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
 



document.addEventListener('DOMContentLoaded', function () {
    const locations = document.querySelectorAll('.location');
    const weatherInfo = document.getElementById('weatherInfo');
    const apiKey = '6aa4598f48a0810a039e7c4a993d88c4'; 
    const apiEndpoint = 'https://api.openweathermap.org/data/2.5/forecast';

    locations.forEach(location => {
        location.addEventListener('click', function () {
            const locationName = this.getAttribute('data-location');
            getWeatherInfo(locationName);
        });
    });

    function getWeatherInfo(locationName) {
        const apiUrl = `${apiEndpoint}?q=${locationName}&appid=${apiKey}`;

        // https://api.openweathermap.org/data/2.5/forecast?q=london&appid=6aa4598f48a0810a039e7c4a993d88c4

        fetch(apiUrl)
            .then(function (response) {
                return response.json();

            })
            .then(function (data) {
                console.log;
                const temperature = data.list[0].main.temp;
                const description = data.list[0].weather[0].description;
                weatherInfo.innerHTML = `<h2>${locationName}</h2>
                                         <p>Temperature: ${temperature}°C</p>
                                         <p>Weather: ${description}</p>`;
            })

    }
});


function fetchCityData(cityName) {
    const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&prop=extracts|pageimages&exintro&titles=${nameForWikiApi}&redirects=1&pithumbsize=400`;

    return fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const cityPage = Object.values(data.query.pages)[0];

            if (!cityPage) {
                throw new Error(`City not found: ${cityName}`);
            }

            const title = cityPage.title;
            const info = cityPage.extract;
            const image = cityPage.thumbnail;

            console.log('Title:', title);
            console.log('Info:', info);
            console.log('Image:', image);


            return { title, info, image };
        })
        .catch(error => {
            console.error('Error fetching city data:', error.message);
        });
}

fetchCityData(cityName);

