//for "dotenv"
require("dotenv").config();
//keys 
var keys = require('./keys.js');
var request = require("request");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
//text require
var fs = require('fs');
//links for keys.js
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
//user inputs
var input = process.argv;
var action = input[2];
var inputs = input[3];

// for (var i = 3; i < input.length; i++) {
// 	if (i > 3 && i < input.length) {
// 		inputs = inputs + " " + input[i];
// 	} else {
// 		inputs += input[i];
// 	}
// }

//set a switch case
switch (action) {
    case "my-tweets":
    twitter(inputs);
    break;

    case "spotify-this-song":
	spotifyMy(inputs);
	break;

	case "movie-this":
	movie(inputs);
	break;

	case "do-what-it-says":
	doIt(inputs);
	break;
}


//twitter function
function twitter(inputs){
	//twitter user & for the last 20 tweets
    var params = {screen_name: 'PutinCake', count: 20};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
            for (i = 0; i < tweets.length; i++){
				//results
                console.log("Tweet: " + "'" + tweets[i].text + "'" + " Created At: " + tweets[i].created_at);
				console.log("=================================================================");
				//append to log.txt
				fs.appendFile('log.txt', tweets[i].text + ' Created at: ' + tweets[i].created_at + '\n=================================================================\n', function(err) {
					if (err) throw err;
					console.log("Saved!");
				});
			}
			
        } else {
            console.log(error);
        }
    });
}


//spotify function
function spotifyMy(inputs) {
	//spotify search method
	if (!inputs){
		inputs = 'The Sign';
	}
		spotify.search({ type: 'track', query: inputs }, function(err, data) {
			if (err){
	            return console.log('Error occurred: ' + err);
			} 
			//try to build a loop but failed!!!
				//  for (var i = 0; i < data.tracks.items.length; i++){
				
			// console.log(data.tracks.items);
			//results
			console.log("==================Results============================");
	        console.log("Artist(s): " + data.tracks.items[0].artists[0].name);
	        console.log("Song Name: " + data.tracks.items[0].name);
	        console.log("Preview Link: " + data.tracks.items[0].preview_url);
			console.log("Album: " + data.tracks.items[0].album.name);
			console.log("==================End============================");
			//append to log.txt
			fs.appendFile('log.txt', 'Artist: ' + data.tracks.items[0].artists[0].name + '\n' + '; Song Name: ' + data.tracks.items[0].name + '\n' + '; Spotify Preview Link: ' + data.tracks.items[0].external_urls.spotify + '\n' + '; Album: ' + data.tracks.items[0].album.name  + '\n=================================================================\n', function(err) {
				if (err) throw err;
				console.log('Saved!');
			});
			
	});
}


//movie function
function movie(inputs) {
	//default movie: 'Mr.Nobody'
	if (!inputs){
		inputs = 'Mr.Nobody';
	}
	//set OMDB API
	//var queryUrl = "http://www.omdbapi.com/?t=" + inputs + "&y=&plot=short&apikey=40e9cece";
	request("http://www.omdbapi.com/?t=" + inputs + "&y=&plot=short&apikey=trilogy", function(error, response, body) {
		
		//other movies results
		if (!error && response.statusCode === 200) {
			console.log("==============================Movie Details========================")
		    console.log("Title: " + JSON.parse(body).Title);
		    console.log("Release Year: " + JSON.parse(body).Year);
		    console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
		    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
		    console.log("Country: " + JSON.parse(body).Country);
		    console.log("Language: " + JSON.parse(body).Language);
		    console.log("Plot: " + JSON.parse(body).Plot);
			console.log("Actors: " + JSON.parse(body).Actors);
			//set a varible = JSON.parse(body) FIRST!!!!!!!!
			var movieInfo = JSON.parse(body);
			//append to log.txt
			fs.appendFile('log.txt', 'Title: ' + movieInfo.Title + '\n' + '; Year: ' + movieInfo.Year + '\n' + '; IMDB Rating: ' + movieInfo.imdbRating + '\n' + '; Country: ' + movieInfo.Country + '\n' + '; Language: ' + movieInfo.Language + '\n' + 'Plot: ' + movieInfo.Plot + '\n' + '; Actors: '+ movieInfo.Actors + '\n' + '; Rotten Tomatoes Rating: ' + movieInfo.Ratings[1].Value + '\n' + '\n=================================================================\n', function(err) {
				if (err) throw err;
				console.log("Saved!");
			});
		} 
		
	});
}

//do what it says function
function doIt() {

	fs.readFile('random.txt', "utf8", function(error, data){

		if (error) {
    		return console.log(error);
  		}

		// Then split it by commas (to make it more readable)
		var dataArr = data.split(",");

		// Each command is represented. Because of the format in the txt file, remove the quotes to run these commands. 
		if (dataArr[0] === "spotify-this-song") {
			var song_info = dataArr[1];
			spotify(song_info);
		} else if (dataArr[0] === "my-tweets") {
			var tweets_name = dataArr[1];
			twitter(tweets_name);
		} else if(dataArr[0] === "movie-this") {
			var movie_name = dataArr[1];
			movie(movie_name);
		} 
		
  	});

};

