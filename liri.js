var keys = require('./keys.js');
var twitter = require('twitter');
var spotify = require('spotify');
var fs = require('fs');
var request = require('request');

var writeToLog = function(data) {
  fs.appendFile("log.txt", '\r\n\r\n');
  fs.appendFile("log.txt", JSON.stringify(data), function(err) {
    if (err) {
      return console.log(err);
    }
    console.log("log.txt was updated!");
  });
}

var tweets = function () {
  var client = new twitter(keys.twitterKeys);
  var parameters = {screen_name: 'Moped Rich', count: 20};
  client.get('statuses/user_timeline', parameters, function(error, tweets, response) {
    if (!error) {
      var data = [];
      for (var i = 0; i < tweets.length; i++) {
        data.push({
          'created at: ' : tweets[i].created_at,
          'Tweets: ' : tweets[i].text,
        });
      }
      console.log(data);
      writeToLog(data);
    }
  });
};

var artistNames = function(artist) {
  return artist.name;
};

var getSpotify = function(track) {
  if (track === undefined) {
    track = "The Sign";
  };
  spotify.search({type: 'track', query: track }, function(err, data) {
    if (err) {
      console.log('Error occurred: ' + err);
      return;
    }

    var songs = data.tracks.items;
    var data = [];

    for (var i = 0; i < songs.length; i++) {
      data.push({
        'atists' : songs[i].artists.map(artistNames),
        'song name' : songs[i].name,
        'song link' : songs[i].preview_url,
        'album' : songs[i].album.name,
      });
    }
    console.log(data);
    writeToLog(data);
  });
};

var getMovie = function(movie) {
    if (movie === undefined) {
      movie = "Mr. Nobody";
    };
    var url = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=full&tomatoes=true&r=json";
    request(url, function(error, response, body){
      if (!error && response.statusCode == 200) {
        var data = [];
        var jsonData = JSON.parse(body);
        data.push({
          'Title: ' : jsonData.Title,
          'Year: ' : jsonData.Year,
          'Rated: ' : jsonData.Rated,
          'IMDB Rating: ' : jsonData.imdbRating,
          'Country: ' : jsonData.Country,
          'Language: ' : jsonData.Language,
          'Plot: ' : jsonData.Plot,
          'Actors: ' : jsonData.Actors,
          'Rotton Tomatoes URL: ' : jsonData.tomatoURL,
        });
        console.log(data);
        writeToLog(data);
      };
    });
}

// var getMovie = function(title) {
//   request('http://http://www.omdbapi.com/?t=' + title, function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//       var jsonData = JSON.parse(body);
//
//       console.log('Title: ' +jsonData.Title);
//       console.log('Year: ' +jsonData.Year);
//       console.log('Rated: ' +jsonData.Rated);
//       console.log('IMDB Rating: ' +jsonData.imdbRating);
//       console.log('Country: ' +jsonData.Country);
//       console.log('Language: ' +jsonData.Language);
//       console.log('Plot: ' +jsonData.Plot);
//       console.log('Actors: ' +jsonData.Actors);
//       console.log('Rotton Tomatoes URL: ' +jsonData.tomatoURL);
//     }
//   });
// }

var doWhatItSays = function() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    console.log(data);
    writeToLog(data);
    var dataArr = data.split(',')
    if (dataArr.length == 2) {
      choose(dataArr[0], dataArr[1]);
    } else if (dataArr.length == 1) {
      choose(dataArr[0]);
    }
  });
}

var choose = function(caseData, functionData) {
  switch (caseData) {
    case 'my-tweets':
      tweets();
      break;
    case 'spotify-this-song':
      getSpotify(functionData);
      break;
    case 'movie-this':
      getMovie(functionData);
      break;
    case 'do-what-it-says':
      doWhatItSays();
      break;
    default:
      console.log('LIRI doesn\'t know that');
  }
}

var runThis = function(argOne, argTwo) {
  choose(argOne, argTwo);
}

runThis(process.argv[2], process.argv[3]);
