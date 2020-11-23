// array to hold all the genres and the matching genreIDs from TMDB
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

// app namespace
const flixmix = {};

// assign url and apiKEY to variables and create empty arrays
flixmix.url = "https://api.themoviedb.org/3";
flixmix.apiKey = "43cf4349cdbabac82573b86e2df23c8e";
flixmix.selectedGenre1 = "";
flixmix.selectedGenre2 = "";
flixmix.returnedMovies = [];
flixmix.finalDirectorList = [];
flixmix.youtubeKey = [];

// AJAX call to return the movies that match the genres selected
flixmix.getMoviesAPICall = (genre1, genre2) => {
  return $.ajax({
    url: `${flixmix.url}/discover/movie`,
    dataType: "json",
    method: "GET",
    data: {
      api_key: flixmix.apiKey,
      with_genres: `${genre1},${genre2}`,
      language: "en-US",
      page: 2,
    },
  });
};

// AJAX call to return the trailers of the returned movies
flixmix.getTrailerAPICall = (ID) => {
  // make a call to /movie/{movie_id}/videos
  return $.ajax({
    url: `${flixmix.url}/movie/${ID}/videos`,
    dataType: "json",
    method: "GET",
    data: {
      api_key: flixmix.apiKey,
      language: "en-US",
      page: 2,
    },
  });
};

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
      page: 2,
    },
  });
};

// function to filter out the director(s) from the total list of crew and store their names along with movieID in an array
flixmix.storeDirectors = (crewArray, mID) => {
  let directorObject = crewArray.filter(function (value) {
    return value.job === "Director";
  });
  let directors = directorObject.map((value) => {
    return value.name;
  });
  // push director(s) to an array
  flixmix.finalDirectorList.push({ movieID: mID, directors: directors });
};

// function to exectute the getCredits AJAX call to get the cast and crew and store in an array for each of the returned movies' AJAX call to be able to eventually retrieve the matching director(s) for each movie
flixmix.filteredMoviesDirectors = (array) => {
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
        // function call to create an array of crew and movie
        flixmix.storeDirectors(crew, movieID);
      });
      flixmix.filteredMoviesTrailer(array);
    })
    // display error message to user if AJAX call unsuccessful
    .fail((err) => {
      flixmix.failureMessage();
    });
};

// AJAX call to get movie trailers for the returned movies and store in an array
flixmix.filteredMoviesTrailer = (array) => {
  let trailers = [];
  array.forEach((movies) => {
    trailers.push(flixmix.getTrailerAPICall(movies.id));
  });
  $.when(...trailers)
    .then(function (...gotTrailers) {
      gotTrailers.forEach((trailer) => {
        flixmix.movieTrailer(trailer[0]);
      });
      // call function to render results on screen
      flixmix.displayMovies(
        array,
        flixmix.finalDirectorList,
        flixmix.youtubeKey
      );
    })
    // display error message to user if AJAX call unsuccessful
    .fail((err) => {
      flixmix.failureMessage();
    });
};

// function to filter out the official trailer or trailer from all movie videos returned
flixmix.movieTrailer = (trailerRes) => {
  const trailerIndex = trailerRes.results;
  const trailerMovieID = trailerRes.id;
  let trailerKey = "";
  if (trailerIndex.length !== 0) {
    for (i = 0; i < trailerIndex.length; i++) {
      if (
        trailerIndex[i].name.includes("Official") &&
        trailerIndex[i].type === "Trailer"
      ) {
        trailerKey = trailerIndex[i].key;
        break;
      } else if (trailerIndex[i].type === "Trailer") {
        trailerKey = trailerIndex[i].key;
      }
    }
  } else {
    trailerKey = "NA";
  }
  flixmix.youtubeKey.push({ movieID: trailerMovieID, TrailerKey: trailerKey });
};

// function to get director of displayed movie to show on sscreen
flixmix.getUltimateDirector = (movieID, directorsArray) => {
  ultimateDirector = "";
  directorsArray.forEach((movie) => {
    if (movie.movieID === movieID) {
      movie.directors.forEach((director) => {
        ultimateDirector = ultimateDirector + director + `&nbsp &nbsp`;
      });
    }
  });
  return ultimateDirector;
};

// function to get trailer key for the movie displayed to be used in youtube trailer search
flixmix.getUltimateTrailerKey = (movieID, youtubeKeyArray) => {
  let trailerKey = "";
  youtubeKeyArray.forEach((movie) => {
    if (movie.movieID === movieID) {
      trailerKey = movie.TrailerKey;
    }
  });
  return trailerKey;
};

// function to render genre names on screen
flixmix.getUltimateGenre = (gIDs) => {
  let ultimateGID = "";
  gIDs.forEach((gid) => {
    for (let i = 0; i < genre.length; i++) {
      if (genre[i].genreID === gid) {
        ultimateGID = ultimateGID + `&nbsp &nbsp${genre[i].genreName}`;
      }
    }
  });
  return ultimateGID;
};

// function to extract the movie's release year
flixmix.getUltimateReleaseYear = (release_date) => {
  let year = release_date;
  year = year.substring(0, 4);
  return year;
};

// function to movie details to variables and display the movie on screen
flixmix.displayMovies = (ultimateMovieArray, directorsArray, youtubeKeyArray) => {
  $(".carousel").empty();
  $(".carousel").removeClass("slick-initialized slick-slider");
  for (let i = 0; i < ultimateMovieArray.length; i++) {
    let ultimateDirector = flixmix.getUltimateDirector(ultimateMovieArray[i].id, directorsArray);
    let trailerKey = flixmix.getUltimateTrailerKey(ultimateMovieArray[i].id, youtubeKeyArray);
    let ultimateGID = flixmix.getUltimateGenre(ultimateMovieArray[i].genre_ids);
    let year = flixmix.getUltimateReleaseYear(ultimateMovieArray[i].release_date);
    let className = "";
    if (trailerKey === "NA") {
      className = "noTrailer";
    } else {
      className = "showTrailer"; 
    }
    // write to the DOM with the movie details
    const htmlString = `
      <div class="moviePick" style="background-image: url('https://image.tmdb.org/t/p/w500/${ultimateMovieArray[i].backdrop_path}')">
          <figure class="moviePoster">
          <img src="https://image.tmdb.org/t/p/w300_and_h450_bestv2/${ultimateMovieArray[i].backdrop_path}" alt="Movie ${ultimateMovieArray[i].title}">
        </figure>
        <div class="info">
          <h3 class="movieTitle"> ${ultimateMovieArray[i].title} <span class="year">(${year})</span></h3>
          <div class="releaseGenre">
            <p class="releaseDate">${ultimateMovieArray[i].release_date}&nbsp</p>
            <span class="pipe">|</span>
            <p class="genre">${ultimateGID}</p>
          </div>
          <div class="scoreTrailer">
              <p class="userScore"><span class="userScoreText">User score:</span> ${ultimateMovieArray[i].vote_average}</p>
              <p class="playTrailer">
                  <a href="https://www.youtube.com/watch?v=${trailerKey}" class="${className}" target="__blank"><i class="fab fa-youtube"></i> Play Trailer</a>
              </p>
          </div>
          <h4 class="overview">Overview</h4>
          <p class="synopsis">${ultimateMovieArray[i].overview}</p>
          <p class="director">${ultimateDirector}</p>
          <p class="directorHeading">Director</p>
        </div> 
      </div>
      `;
    $(".carousel").append(htmlString);
  }
  // apply Slick carousel functionality
  $(".carousel").slick({});
};

// function to handle API errors and display useful information to the user
flixmix.failureMessage = () => {
  $(".carousel").empty();
  $(".carousel").removeClass("slick-initialized slick-slider");
  let errorHtml = ` 
    <div class="displayFailure">
      <p>Something went wrong. Please try again later!</p>
    </div>
    `;
  $(".carousel").append(errorHtml);
};

// AJAX call to the movies from the user selected genres and store the results into an array
flixmix.getGenres = (selectedGenre1, selectedGenre2) => {
  $.when(flixmix.getMoviesAPICall(selectedGenre1, selectedGenre2))
    .then(function (res) {
      console.log(res.results);
      flixmix.returnedMovies = res.results;
      flixmix.filteredMoviesDirectors(flixmix.returnedMovies);
    })
    // display error message to user if AJAX call unsuccessful
    .fail((err) => {
      flixmix.failureMessage();
    });
};

// on user Clicking Find Movies, make a get genre API call
flixmix.findMovies = () => {
  flixmix.finalDirectorList.length = 0;
  flixmix.youtubeKey.length = 0;
  flixmix.selectedGenre1 = "";
  flixmix.selectedGenre2 = "";
  $(".landingPageMessage").addClass("hide");
  flixmix.selectedGenre1 = $(".genre1").find(":selected").val();
  flixmix.selectedGenre2 = $(".genre2").find(":selected").val();
  flixmix.getGenres(flixmix.selectedGenre1, flixmix.selectedGenre2);
};

// vvent listener for the submit button when genres are selected
flixmix.eventListner = () => {
  $("form").on("submit", (e) => {
    e.preventDefault();
    flixmix.findMovies();
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