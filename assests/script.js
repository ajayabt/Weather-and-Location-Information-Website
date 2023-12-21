// let latitude = 47; //from googlemaps API
//    let longitude = 9;  //from googlemaps API
//    let userName = "ajayabt"; //API key


// function fetchNearbyWikipediaEntries(latitude, longitude, username) {
//     const geonamesQueryUrl = `http://api.geonames.org/findNearbyWikipediaJSON?lat=${latitude}&lng=${longitude}&username=${username}`;

//     fetch(geonamesQueryUrl)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
//             return response.json();
//         })
//         .then(data => {
//            console.log(data); // Logic here...
//           let nameForWikiApi = console.log(data.geonames[0].title)
//         })
//         .catch(e => {
//             console.error('Error fetching data: ', e);
//         });
// }

// // Example usage
// fetchNearbyWikipediaEntries(latitude, longitude, userName);

// console.log(nameForWikiApi)


const nameForWikiApi = "London";

function fetchWikiInfo() {
    const apiUrl = `https://www.mediawiki.org/w/api.php?action=query&prop=extracts|pageimages&titles=${nameForWikiApi}&pithumbsize=100`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const title = data.query.pages[0].title;
            const info = data.query.pages[0].extract;
            const image = data.query.pages[0].thumbnail ? data.query.pages[0].thumbnail.source : null;

            console.log('Title:', title);
            console.log('Info:', info);
            console.log('Image:', image);

        })
        .catch(e => {
            console.error('Error fetching data: ', e);
        });
}