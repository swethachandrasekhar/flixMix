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

// assign url and apiKEY to variables
flixmix.url = 'https://api.themoviedb.org/3';
flixmix.apiKey = '43cf4349cdbabac82573b86e2df23c8e';
flixmix.selectedGenre1 = '';
flixmix.selectedGenre2 = '';
flixmix.returnedMovies = [];

// create AJAX call to return the movies that match the genres selected
flixmix.getMoviesAPICall = (genre1, genre2) => {
    return $.ajax ({
        url: `${flixmix.url}/discover/movie`,
        dataType: 'json',
        method: 'GET',
        data: {
            api_key: flixmix.apiKey,
            with_genres: `${genre1},${genre2}`,
            language: 'en-US',
            page: 1
            // check for more options
        }
    })
}




// store the results from the API call into an array
flixmix.getMovies = (selectedGenre1, selectedGenre2) => {
    $.when(flixmix.getMoviesAPICall(selectedGenre1, selectedGenre2))
        .then(function (res) {
             console.log(res.results);
            flixmix.filteredMovies(res.results);           
        })
}


 flixmix.getCreditsAPICall = (movieID) => {
    //make a call to /movie/{movie_id}/credits 
    return $.ajax ({
        url: `${flixmix.url}/movie/${movieID}/credits`,
        dataType: 'json',
        method: 'GET',
        data: {
            api_key: flixmix.apiKey,
            language: 'en-US',
            page: 1
        }
    })
}


flixmix.directors = [];
flixmix.finalDirectorList = [];
flixmix.storeDirectors = (crewArray, mID) => {

    let directorObject = crewArray.filter( function(value){
              return value.job === 'Director'
              
        }) 
      
      
      let test1 =  directorObject.map((value)=>{
            return value.name
       })
    //    console.log(`Value of test1 is ${test1}`);

       flixmix.finalDirectorList.push({ movieID: mID, directors: test1 });

      
   
    //    console.log(`director names array ${flixmix.directors}`);


};


flixmix.filteredMovies = (array) => {
    console.log(array, `inside filtered`);
//get director for each movie 
let directors = [];
    array.forEach(movies => {
      directors.push(flixmix.getCreditsAPICall(movies.id));
    });
     $.when(...directors)
      .then(function (...gotDirectors) {
           gotDirectors.forEach((item)=>{
            console.log(`for Movie ID`, item[0].id);
            let crew = item[0].crew;
            let movieID = item[0].id;
            flixmix.storeDirectors(crew, movieID);
             
            
        })
        flixmix.finalDirectorList.forEach((element) => {
          //    console.log(`directors array $element);
          console.log(`directors array with Movie ID ${element.movieID} and director names ${element.directors}` );
        });
    
    })
    
} 


// Event listener for the submit button when genres are selected
flixmix.eventListner = () => {
    $('form').on('submit', (e) => {
        e.preventDefault();
        flixmix.selectedGenre1 = $('.genre1').find(':selected').val();
        flixmix.selectedGenre2 = $('.genre2').find(':selected').val();
        console.log(flixmix.selectedGenre1);
        console.log(flixmix.selectedGenre2);
        flixmix.getMovies(flixmix.selectedGenre1, flixmix.selectedGenre2);
    })
}



// Initialize function
flixmix.init = () => {   
    flixmix.eventListner()
}

// Document ready
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

