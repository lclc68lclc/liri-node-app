//grab the data from keys.js
var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");


var pickArg = function(action, responseData) {
    switch (action) {
        case 'my-tweets':
            myTweets();
            break;
        case 'spotify-this-song':
            spotifyThatSong();
            break;
        case 'movie-this':
            movieThis();
            break;
        case 'do-what-it-says':
            doItWell();
            break;
        default:
            console.log("I do not understand");
    }
}



//code for my-tweets
//this will show your last 20 tweets
function myTweets() {

    var twitterKeys = keys.twitterKeys;

    var client = new Twitter(keys.twitterKeys);


    var params = { screen_name: "linaclark96" };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                console.log(tweets[i].created_at);
                console.log(tweets[i].text);
                console.log("========================");
            }
        } else {
            console.log(error);
        }
    });
}


//code for spotify-this-song
//this will show the artist, song's name, preview link of the song and the album
//if no song is provided, it will default to "The Sign" by Ace of Base

function getArtist(artist) {
    return artist.name;
}

function spotifyThatSong(name) {

    var spotify = new Spotify({
        id: "f2b90fa89d71401dbcee976d3aa148c4",
        secret: "27f031d07a4f41f58bdae4dd7f99631f"
    });

    spotify.search({ type: 'track', query: name }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var track = data.tracks.items;
        console.log(track);
        console.log("=========================================");
        console.log('artist: ' + track.artists.map(getArtist));
        console.log('song name: ' + track.name);
        console.log('preview song: ' + track.preview_url);
        console.log('album: ' + track.album.name);
        console.log("=========================================");
    });
}

spotifyThatSong("The Sign");


//code for movie this
//will output the title of the movie, release year, imdb rating, rotten tomatoes rating
//country movie was produced, language of the movie, plot and actors
//if no movie is provided, it will default to Mr.Nobody
//use api key '40e9cece'

function movieThis(movieName) {
    if (movieName === undefined) {
        movieName = 'Mr Nobody';
    }
    var queryURL = "http://www.omdbapi.com/?apikey=40e9cece&t=" + movieName + "&y=&plot=short&tomatoes=true&r=json";

    request(queryURL, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var dataArr = [];
            var movieData = JSON.parse(body);

            dataArr.push({
                'Title: ': movieData.Title,
                'Year: ': movieData.Year,
                'Rated: ': movieData.Rated,
                'IMDB Rating: ': movieData.imbdRating,
                'Country: ': movieData.Country,
                'Language: ': movieData.Language,
                'Actors: ': movieData.Actors,
                'Rotten Tomatoes Rating: ': movieData.tomatoRating,
            });
            console.log(dataArr);
        }
    });

}

//code for do-what-it-says
//using fs, take the text inside the random text and use it to call one of Liri's commands

function doItWell() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        console.log(data);
        var datArr = data.split(',');

        if (datArr.length == 2) {
            pickArg(datArr[0], datArr[1]);
        } else if (datArr.length == 1) {
            pickArg(datArr[0]);
        }
    });
}

function runIt(argOne, argTwo) {
    pickArg(argOne, argTwo);
}

runIt(process.argv[2], process.argv[3]);



//Bonus: output the data into a log.txt that you test from the commands