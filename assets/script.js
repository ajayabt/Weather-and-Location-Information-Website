// 1. Map is loaded
// the paramaters we'll need: where it shows initialy, 
// output lon and lat on click pass to geonames
// use geonames API to search wikipedia for nearby locations
// wikipedia will need to return image, information and name
// Name passed to weather API, call the weather

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

    var marker = new google.maps.Marker({
        position: { lat: 0, lng: 0 },
        map: map,
        draggable: true, 
        animation: google.maps.Animation.DROP 
    });
   
//event listener for click to output lat and lon
    map.addListener('click', function(event) {
        var latLng = event.latLng;
        marker.setPosition(event.latLng);
        console.log('Latitude: ' + latLng.lat() + ', Longitude: ' + latLng.lng());
    
        //calling the functions defined later within the event listener,
        fetchNearbyWikipediaEntries(latLng.lat(), latLng.lng(), 'ajayabt', handleWikiData);

        fetchAndDisplayWeather(latLng.lat(), latLng.lng());  // Fetch weather data based on lat and lng, see paramaters for function
    });
}
//callback function due to asynchronicity, converts the lat and lon into a title name for wiki
function fetchNearbyWikipediaEntries(latitude, longitude, username, callback) {
    const geonamesQueryUrl = `https://secure.geonames.org/findNearbyWikipediaJSON?lat=${latitude}&lng=${longitude}&username=${username}`;

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
    fetchWikipediaData(title, latitude, longitude);  // Fetch Wikipedia data based on title
}

//wiki API logic
function fetchWikipediaData(title, callback) {
    const wikipediaApiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts|pageimages&titles=${encodeURIComponent(title)}&pithumbsize=600&origin=*`;

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

                displayWikipediaData(extract, imageUrl, title);

            }

        })
        .catch(e => {
            console.error('Error fetching Wikipedia data: ', e);
        });
}

//basic display funtion for the wiki content, function called above in the fetchWikipediaData block
function displayWikipediaData(extract, imageUrl, title) {
    // remove references and external links (they are not showing correctly and look messy!)
    let tempDiv = document.createElement('div');
    tempDiv.innerHTML = extract;

    $(tempDiv).find('h2:contains("References"), h2:contains("External links"), h2:contains("images"), h2:contains("Gallery"), h2:contains("Notes")').each(function () {
        $(this).nextUntil('h2').remove();
        $(this).remove();
    });
    let editedExtract = tempDiv.innerHTML;

    let card = $('<div>').addClass('card shadow m-3 p-3');

    // Card title and body section
    let titleSection = $('<div>').addClass('card-header bg-primary text-white');
    let titleElement = $('<h1>').html(title);
    titleSection.append(titleElement);

    let cardBody = $('<div>').addClass('card-body row');

    // Left column
    let leftColumn = $('<div>').addClass('col-md-6');
    let contentElement = $('<div>').html(editedExtract);
    leftColumn.append(contentElement);

    // Right column
    let rightColumn = $('<div>').addClass('col-md-6 d-flex flex-column align-items-center');
    let imageElement = $('<img>').addClass('img-fluid mb-3').css('object-fit', 'cover').attr('src', imageUrl);
    rightColumn.append(imageElement);

    // Append columns to the card body
    cardBody.append(leftColumn, rightColumn);

    // Save to Favorites button
    let saveButton = $('<button>').text('Save to Favourites').addClass('save-fav-btn btn btn-secondary btn-lg btn-block mt-3').attr('data-title', title).attr('data-image', imageUrl);
    cardBody.append(saveButton);

    card.append(titleSection, cardBody);

    $('#wikipedia-content').html(card);
}

//save to local storage array for favourites
function saveToFavourites(title, imageUrl) {
    let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
    favourites.push({ title, imageUrl });
    localStorage.setItem('favourites', JSON.stringify(favourites));
    displayFavourites();  // Update favourites display
}

//saveButton click event: 
$(document).on('click', '.save-fav-btn', function () {

    let title = $(this).data('title');
    let imageUrl = $(this).data('image');
    saveToFavourites(title, imageUrl);
    let banner = $('<div>').text('Saved to Favourites').addClass('save-banner')


    $('body').append(banner);


    banner.fadeIn(500).delay(2000).fadeOut(500, function () {
        $(this).remove();
    });
    $('#clearFavs').show()
    $('.favsNavBar').show();


});
//clear favs button 

$('#clearFavs').on('click', function () {
    localStorage.removeItem('favourites');
    $('#clearFavs').hide();
    $('.favsNavBar').hide()
    displayFavourites();
});

//display favourites

function displayFavourites() {
    let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
    let favContainer = $('#favs');
    favContainer.empty();
    favourites.forEach(fav => {
        let favCard = $('<div>').addClass('favourite-card card col-lg-4');
        let favTitle = $('<h3>').addClass('card-title').text(fav.title);

        let favImageSrc = fav.imageUrl || 'https://placehold.co/600x400?text=No+Wikipedia+Image';
        let favImage = $('<div>')
            .addClass('card-img-top')
            .css('background-image', `url(${favImageSrc})`);
        let infoButton = $('<button>')
            .addClass('favButton btn btn-primary')
            .text('Show Article')
            .data('title', fav.title);
        favCard.append(favTitle, favImage, infoButton);
        favContainer.append(favCard);
        $('.favsNavBar').show();
        $('#clearFavs').show();

        ;
    });
}


//favourites card event listener=> display wikipedia information in
$(document).on('click', '.favButton', function (event) {
    event.preventDefault();
    let title = $(this).data('title');
    const wikipediaApiUrlModal = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts|pageimages&titles=${encodeURIComponent(title)}&pithumbsize=100&origin=*`;

    fetch(wikipediaApiUrlModal)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // as the call function for wiki data above, however removing the display functions to stop it replacing existing content
            if (data.query && data.query.pages) {
                const pageId = Object.keys(data.query.pages)[0];
                const pageData = data.query.pages[pageId];

                const extract = pageData.extract || "No extract available";
                const imageUrl = pageData.thumbnail ? pageData.thumbnail.source : "";

                let tempDiv = document.createElement('div');
                tempDiv.innerHTML = extract;

                $(tempDiv).find('h2:contains("References"), h2:contains("External links"), h2:contains("Gallery"), h2:contains("images"), h2:contains("Gallery"), h2:contains("Notes")').each(function () {
                    $(this).nextUntil('h2').remove();
                    $(this).remove();
                });
                let editedExtract = tempDiv.innerHTML
                console.log("Title in displayWikipediaData:", title);
                console.log(editedExtract);

                $('#wikiModalContent').html(editedExtract);
                $('#wikiModal').modal('show');
                $('#wikiModalLabel').text(title);

            }

        });
});


displayFavourites();
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


//Pop up weather function to display over map

function displayWeather(forecastData) {
    let weatherIcon = forecastData.weather[0].icon;
    let nameDisplay = $('<h2>').text(forecastData.name);
    let iconDisplay = $('<img>').attr('src', 'https://openweathermap.org/img/w/' + weatherIcon + '.png');
    let dateAndTime = $('<h2>').text('Current date: ' + dayjs().format('DD-MM-YYYY'));
    let tempDisplay = $('<h2>').text('Current temperature: ' + forecastData.main.temp.toFixed(1) + ' \u00B0C');
    let humidityDisplay = $('<h2>').text('Humidity: ' + forecastData.main.humidity.toFixed(1) + '%');
    let windSpeedDisplay = $('<h2>').text('Wind speed: ' + forecastData.wind.speed.toFixed(1) + ' mph');
    let closeForWiki = $('<h2>').text('Close and scroll down for some information about the area').addClass('closeForWiki')

    let weatherModalBody = $('#weatherModalBody').addClass('weatherModalText');
    weatherModalBody.empty();
    weatherModalBody.append(nameDisplay, iconDisplay, dateAndTime, tempDisplay, humidityDisplay, windSpeedDisplay, closeForWiki);
   $('#weatherModal').modal('show');
}
