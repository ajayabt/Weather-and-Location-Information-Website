// 1. Map is loaded
   // the paramaters we'll need: where it shows initialy, 
   // output lon and lat on click pass to geonames
   // use geonames API to search wikipedia for nearby locations
   // wikipedia will need to return image, information and name
   // Name passed to weather API, call the weather
   


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
