//Javascript

//Storage 
// Make an object array which stores genre ID and Genre Name
//Store the API results in an object array

// Make API Calls
// 1. Call with query param "genres"
// 2. Call to movies end point  to get youtube ID


//EVENT LISTENERS 
//1. On SUBMIT, validate the dropdown options and store in two variables
//2. On 'find another movie' call the random movie Display function
//On click "play Trailer" make an API Call to /movie/videos end point and get the youtube ID
//And create a youtube search query and create a pop up to play trailer

const flixmix = {}

flixmix.url = 'https://api.themoviedb.org/3';
flixmix.apiKey = '43cf4349cdbabac82573b86e2df23c8e';

flixmix.getMoviesAPICall = (genre1, genre2) => {
    return $.ajax ({
        url: `${flixmix.url}/discover/movie`,
        dataType: 'json',
        method: 'GET',
        data: {
            api_key: flixmix.apiKey,
            with_genre: genre1,
            with_genre: genre2,
            language: 'en-US',
            page: 1
        }
    })
}



flixmix.returnedMovies = [];

flixmix.getMovies = function (selectedGenre1, selectedGenre2) {
    let moviesArray = flixmix.getMoviesAPICall(selectedGenre1, selectedGenre2);

    console.log(moviesArray);

}

flixmix.eventListner = () => {
    $('form').on('submit', (e) => {
        e.preventDefault();
        let selectedGenre1 = $('.genre1').find(':selected').val();
        let selectedGenre2 = $('.genre2').find(':selected').val();
        console.log(selectedGenre1);
        console.log(selectedGenre2);
        // flixmix.getMoviesAPICall(selectedGenre1, selectedGenre2);
        flixmix.getMovies(selectedGenre1, selectedGenre2);
    })
}

flixmix.init = () => {
    
    flixmix.eventListner()



}



$(function() {
    flixmix.init()
});


//TO DO 
//Create a form with two dropdowns
//Create a function to lookup Genre ID based on the input
//Make an API call with the GID to get the movies list of top 50
// .then()-> parse the list for movies that contain both the IDs and write a function filter the top 25/30
//store in an object array 
//Create a function to get a random movie from the list and make an API call to get the credits(Director)
//display a random movie and description from the above array


// QUESTIONS
// 1. Making API calls when needed or call and store everything from the get go?
//What's a reasonable number of results to show the users?

