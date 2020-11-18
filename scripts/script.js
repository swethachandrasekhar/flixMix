//APP NAME TBD (Jon says NetMix)


//API used - movieDB API 

//An app that returns a Movie for you to watch based on 1/2 genre selection. 

//Two dropdown/selection where user can select a genre
//And clicks submit
//App returns a list of movies and we randomly display one choice at a time
//User can click "Find Another"

//STRETCH GOALS

// 1. Option to select different languages
// 2. Display a carousel of movies
// 3. Make the  movie poster as the background for result
// 4. Choose another genre(add genre)
// 5. Play trailer in an overlay/pop up from youtube
// 6. Provide options to input filter options i.e highest rated



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

