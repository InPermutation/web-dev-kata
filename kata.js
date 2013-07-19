var fs = require('fs');

function readTweets(file) {
   var fileData = file.split("\n");

   var tweets = [];
   while(fileData.length > 0) {
       var data = fileData.splice(0, 4);
       tweets.push({
           userName: data[0],
           message: data[1],
           date: data[2]
       });
   }

   return tweets;
}

function formatTweet(tweet) {
    return "\n<DIV CLASS='tweet'>\n" +
    "<H1>" + tweet.userName + "</H1>" +
    "<P>" + tweet.message + "</P>" +
    "<time>" + tweet.date + "</time>" +
    "\n</DIV>\n";
}

function writeTweets(tweets) {
    // LOL Web scale
    fs.writeFileSync('_site/index.html',
        "<!DOCTYPE html>\n" +
        "<HTML>\n" +
        "<HEAD>\n" +
            "<TITLE>${Microblog} for dummies</TITLE>\n" +
            "<link rel='stylesheet' type='text/css' href='theme.css' />\n" +
        "</HEAD>" +
        "<BODY>\n" +
        tweets.map(formatTweet).join('') +
        "\n</BODY></HTML>");
}


// LOL Web scale
var contents = fs.readFileSync('sample-tweets.txt', {'encoding': 'UTF-8'});

var tweets = readTweets(contents);

writeTweets(tweets);
