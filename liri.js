// file configuration
require("dotenv").config();
var fs = require("fs");
var keys = require("./keys.js");
var request = require('request');
var Spotify = require('node-spotify-api');
var moment = require('moment');

var spotify = new Spotify(keys.spotify);


var userInput = process.argv[2];

var inputValue = process.argv[3];



// switch statement for all the deifne case 
function searchInput() {

  switch (userInput) {

    case 'concert-this':
      bandsInTown(inputValue);
      break;

    case 'spotify-this-song':
      findSong(inputValue);
      break;

    case 'movie-this':
      movieInfo(inputValue);
      break;

    case 'do-what-it-says':
      getRandom();
      break;

    default:
      textLog("Invalid Instruction");
      break;

  }
};


//  function for concert-this
function bandsInTown(inputValue) {

  if (userInput === 'concert-this') {
    var artist = "";
    for (var i = 3; i < process.argv.length; i++) {
      artist += process.argv[i];
    }
    // console.log(artist);
  }
  else {
    artist = inputValue;
  }


  var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";


  request(queryUrl, function (error, response, body) {

    if (!error && response.statusCode === 200) {

      var JS = JSON.parse(body);
      for (i = 0; i < 4; i++) {

        var dTime = JS[i].datetime;
        //formating date and time from moments js
        var date = moment(dTime).format('L')
        var time = moment(dTime).format('LT')
        textLog("\n---------------------------------------------------");
        textLog("**********  " + artist + "  **********  " + JS[i].venue.city + "  **********");
        textLog("\n---------------------------------------------------");
        textLog("Date: " + date);
        textLog("Time: " + time);
        textLog("Name: " + JS[i].venue.name);
        textLog("City: " + JS[i].venue.city);
        if (JS[i].venue.region !== "") {
          textLog("Country: " + JS[i].venue.region);
        }
        textLog("Country: " + JS[i].venue.country);

      }
    }
  });
}

// function for spotify-this-song by user inputValue
function findSong(inputValue) {

  var searchTrack;
  if (inputValue === undefined) {
    searchTrack = "Hello Kitty";
  } else {
    searchTrack = inputValue;
  }

  spotify.search({
    type: 'track',
    query: searchTrack
  }, function (error, data) {
    if (error) {
      textLog('Error occurred: ' + error);
      return;
    }
    // log response data to the log.txt file   
    else {
      textLog("\n---------------------------------------------------");
      textLog("**********  Songs Information  **********");
      textLog("Artist: " + data.tracks.items[0].artists[0].name);
      textLog("Song: " + data.tracks.items[0].name);
      textLog("Preview: " + data.tracks.items[0].preview_url);
      textLog("Album: " + data.tracks.items[0].album.name);
      textLog("\n---------------------------------------------------");
    }
  });
};

// function for movie-this to get movie info

function movieInfo(inputValue) {


  var findMovie;
  if (inputValue === undefined) {
    findMovie = "Mr. Nobody";
  } else {
    findMovie = inputValue;
  };

  var queryUrl = "http://www.omdbapi.com/?t=" + findMovie + "&y=&plot=short&apikey=trilogy";

  request(queryUrl, function (err, res, body) {
    var bodyOf = JSON.parse(body);
    // log response data to the log.txt file 
    if (!err && res.statusCode === 200) {
      textLog("\n---------------------------------------------------");
      textLog("**********  Movie Information  **********");
      textLog("Title: " + bodyOf.Title);
      textLog("Release Year: " + bodyOf.Year);
      textLog("IMDB Rating: " + bodyOf.imdbRating);
      textLog("Rotten Tomatoes Rating: " + bodyOf.Ratings[1].Value);
      textLog("Country: " + bodyOf.Country);
      textLog("Language: " + bodyOf.Language);
      textLog("Plot: " + bodyOf.Plot);
      textLog("Actors: " + bodyOf.Actors);
      textLog("\n---------------------------------------------------");
    }
  });
};

// get input from random.text file
function getRandom() {
  fs.readFile('random.txt', "utf8", function (error, data) {

    if (error) {
      return textLog(error);
    }

    var dataArr = data.split(",");

    if (dataArr[0] === "spotify-this-song") {
      var songcheck = dataArr[1].trim().slice(1, -1);
      findSong(songcheck);
    }
    else if (dataArr[0] === "concert-this") {
      if (dataArr[1].charAt(1) === "'") {
        var dLength = dataArr[1].length - 1;
        var data = dataArr[1].substring(2, dLength);
        console.log(data);
        bandsInTown(data);
      }
      else {
        var bandName = dataArr[1].trim();
        console.log(bandName);
        bandsInTown(bandName);
      }

    }
    else if (dataArr[0] === "movie-this") {
      var movie_name = dataArr[1].trim().slice(1, -1);
      movieInfo(movie_name);
    }

  });

};
//  function to log response results to the log.txt file
function textLog(dataToLog) {

  console.log(dataToLog);

  fs.appendFile('log.txt', dataToLog + "\n", function (err) {

    if (err) return textLog('Error logging data to file: ' + err);
  });
}


searchInput();