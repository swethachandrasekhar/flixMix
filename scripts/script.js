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


const genre = [
  {
    genreID: 28,
    genreName: "Action",
  },
  {
    genreID: 12,
    genreName: "Adventures",
  },
  {
    genreID: 16,
    genreName: "Animations",
  },
  {
    genreID: 35,
    genreName: "Comedy",
  },
  {
    genreID: 99,
    genreName: "Documentary",
  },
  {
    genreID: 18,
    genreName: "Drama",
  },
  {
    genreID: 10751,
    genreName: "Family",
  },
  {
    genreID: 14,
    genreName: "Fantasy",
  },
  {
    genreID: 36,
    genreName: "History",
  },
  {
    genreID: 27,
    genreName: "Horror",
  },
  {
    genreID: 10402,
    genreName: "Music",
  },
  {
    genreID: 9648,
    genreName: "Mystery",
  },
  {
    genreID: 10749,
    genreName: "Romance",
  },
  {
    genreID: 878,
    genreName: "Sci-Fi",
  },
  {
    genreID: 10770,
    genreName: "TV-Movie",
  },
  {
    genreID: 53,
    genreName: "Thriller",
  },
  {
    genreID: 10752,
    genreName: "War",
  },
  {
    genreID: 37,
    genreName: "Western",
  },
];

const flixmix = {};

// assign url and apiKEY to variables
flixmix.url = "https://api.themoviedb.org/3";
flixmix.apiKey = "43cf4349cdbabac82573b86e2df23c8e";
flixmix.selectedGenre1 = "";
flixmix.selectedGenre2 = "";
flixmix.returnedMovies = [];
flixmix.directors = [];
flixmix.finalDirectorList = [];
flixmix.youtubeKey = [];


// create AJAX call to return the movies that match the genres selected
flixmix.getMoviesAPICall = (genre1, genre2) => {
    return $.ajax({
        url: `${flixmix.url}/discover/movie`,
        dataType: "json",
        method: "GET",
        data: {
            api_key: flixmix.apiKey,
            with_genres: `${genre1},${genre2}`,
            language: "en-US",
            page: 1
            // check for more options
        }
    })
}
        


// AJAX call to return the trailer for the ultimate choice movie
flixmix.getTrailerAPICall = (ID) => {
    // make a call to /movie/{movie_id}/videos
    return $.ajax({
        url: `${flixmix.url}/movie/${ID}/videos`,
        dataType: 'json',
        method: 'GET',
        data: {
            api_key: flixmix.apiKey,
            language: "en-US",
            page: 1,
        }
    })
}

// AJAX call to return the movie crew of returned movies
flixmix.getCreditsAPICall = (movieID) => {
  //make a call to /movie/{movie_id}/credits
  return $.ajax({
    url: `${flixmix.url}/movie/${movieID}/credits`,
    dataType: "json",
    method: "GET",
    data: {
      api_key: flixmix.apiKey,
      language: "en-US",
      page: 1,
    },
  });
};




// Function to filter out the director(s) from the total list of crew and store their names along with movieID in an array
flixmix.storeDirectors = (crewArray, mID) => {
    let directorObject = crewArray.filter(function (value) {
        return value.job === "Director";
    });
    let directors = directorObject.map((value) => {
        return value.name;
    });

    flixmix.finalDirectorList.push({ movieID: mID, directors: directors });
};

// Function to exectute the getCredits AJAX call to get the cast and crew and store in an array for each of the returned movies' AJAX call to be able to eventually retrieve the director(s) for each movie
flixmix.filteredMovies = (array) => {
    //get director for each movie
    let directors = [];
    let trailers = [];
    array.forEach((movies) => {
        directors.push(flixmix.getCreditsAPICall(movies.id));
        trailers.push(flixmix.getTrailerAPICall(movies.id));
    });
    $.when(...directors)
        .then(function (...gotDirectors) {
            gotDirectors.forEach((item) => {
                const crew = item[0].crew;
                const movieID = item[0].id;
                // Function call to create an array of crew and movie
                flixmix.storeDirectors(crew, movieID);
            });
            // flixmix.finalDirectorList.forEach((element) => {
            //     //    console.log(`im hererr`);
            //     //    console.log(` ${element.movieID} and ${element.directors}`);
            // });
            console.log(flixmix.finalDirectorList);
            flixmix.getARandomMovie(flixmix.finalDirectorList); // <----- WAS RETURNING 0 OUTSIDE OF THIS FUNCTION
        });
    $.when(...trailers)
        .then(function (...gotTrailers) {
            console.log(`gotTrailer`, gotTrailers);
            gotTrailers.forEach((trailer) => {
                flixmix.movieTrailer(trailer[0])
            })

            console.log(flixmix.youtubeKey);
        })

};

// Function to get find the trailer for ultimate movie from all movie videos returned
flixmix.movieTrailer = (trailerRes) => {
    const trailerIndex = trailerRes.results;
    const trailerMovieID = trailerRes.id;
    console.log(trailerIndex);
    let trailerKey ='';

    if (trailerIndex.length !== 0){
      for (i = 0; i < trailerIndex.length; i++) {
        if (
          trailerIndex[i].name.includes("Official") &&
          trailerIndex[i].type === "Trailer"
        ) {
          console.log("im inside first if condition");
          trailerKey = trailerIndex[i].key;
          break;
        } else if (trailerIndex[i].type === "Trailer") {
          console.log("im inside second if condition");
          trailerKey = trailerIndex[i].key;
        }
      }

       console.log(trailerKey);
     
    } else {
         trailerKey = 'NA'
        
    }
     flixmix.youtubeKey.push({'movieID':trailerMovieID, 'TrailerKey': trailerKey });

 
}

// Function to display the ultimate movie on screen
flixmix.displayUltimateMovie = (ultimateMovie) => {
    let year = ultimateMovie.release_date;
    year = year.substring(0, 4);
    console.log(genre);

    gIDs = ultimateMovie.genre_ids
    let ultimateGID = '';
    gIDs.forEach(gid => {
        for (let i = 0; i < genre.length; i++) {
            if (genre[i].genreID === gid) {
                ultimateGID = ultimateGID + ` ${(genre[i].genreName)}`;
            }
        }
    })

    // Call AJAX call function to get ultimate movie videos array
    flixmix.getTrailerAPICall(ultimateMovie.id);

    // let youtubesearchURL = ;

    const htmlString = `
            <figure class="moviePoster">
                <img src="${ultimateMovie.backdrop_path}" alt="Movie ${ultimateMovie.title}"
            </figure>
            <div>
                <h3 class="movieTitle"> ${ultimateMovie.title} <span class="year">${year}</span></h3>
                <p class="releaseDate">${ultimateMovie.release_date}</p>
                <p class="genre">${ultimateGID}</p>
                <div>
                    <p class="userScore">${ultimateMovie.vote_average}</p>
                    <p class="playTrailer">
                        <a href="https://www.youtube.com/watch?v=${flixmix.youtubeKey}">Play Trailer</a>
                    </p>
                </div>
                <h4 class="overview">Overview</h4>
                <p class="synoposis">${ultimateMovie.overview}</p>
                <p class="director"></p>
                <p>Director</p>
            </div> `;
};



// store the results from the API call into an array
flixmix.getMovies = (selectedGenre1, selectedGenre2) => {
    $.when(flixmix.getMoviesAPICall(selectedGenre1, selectedGenre2))
        .then(function (res) {
            console.log(res.results);
            flixmix.returnedMovies = res.results;
            flixmix.filteredMovies(flixmix.returnedMovies);
        }
        );
};

// Event listener for the submit button when genres are selected
flixmix.eventListner = () => {
    $("form").on("submit", (e) => {
        e.preventDefault();
        flixmix.selectedGenre1 = $(".genre1").find(":selected").val();
        flixmix.selectedGenre2 = $(".genre2").find(":selected").val();
        console.log(flixmix.selectedGenre1);
        console.log(flixmix.selectedGenre2);
        flixmix.getMovies(flixmix.selectedGenre1, flixmix.selectedGenre2);
    });
};


// Get a random movie from the list of movies in the finalDirectors Array

flixmix.getARandomMovie = (directorsArray) => {
  const index = Math.floor(Math.random() * directorsArray.length);
  const ultimateMovieID = directorsArray[index].movieID;
  console.log(`ultimate`, ultimateMovieID);
  const ultimateMovieDeets = flixmix.returnedMovies.filter((movie) => {
    console.log(movie.id);
    return movie.id === ultimateMovieID;
  });

  console.log(` moviedeets`, ultimateMovieDeets);

  flixmix.displayUltimateMovie(ultimateMovieDeets[0]);
};

// store the results from the API call into an array
flixmix.getMovies = (selectedGenre1, selectedGenre2) => {
  $.when(flixmix.getMoviesAPICall(selectedGenre1, selectedGenre2)).then(
    function (res) {
      console.log(res.results);
      flixmix.returnedMovies = res.results;
      flixmix.filteredMovies(flixmix.returnedMovies);
    }
  );
};

// Event listener for the submit button when genres are selected
flixmix.eventListner = () => {
  $("form").on("submit", (e) => {
    e.preventDefault();
    flixmix.selectedGenre1 = $(".genre1").find(":selected").val();
    flixmix.selectedGenre2 = $(".genre2").find(":selected").val();
    console.log(flixmix.selectedGenre1);
    console.log(flixmix.selectedGenre2);
    flixmix.getMovies(flixmix.selectedGenre1, flixmix.selectedGenre2);
  });
};

// Initialize function
flixmix.init = () => {
    flixmix.eventListner();
};

// Document ready
$(function () {
    flixmix.init();
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
