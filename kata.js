var fs = require('fs');

function readTweet(file) {
   var data = file.split("\n").splice(0,3);
   return {
       userName: data[0],
       message: data[1],
       date: data[2]
   };
}

function writeTweet(tweet) {
    // LOL Web scale
    fs.writeFileSync('_site/index.html',
        "<!DOCTYPE html>\n" +
        "<HTML>\n" +
        "<HEAD>\n" +
            "<TITLE>${Microblog} for dummies</TITLE>\n" +
            "<link rel='stylesheet' type='text/css' href='theme.css' />\n" +
        "</HEAD>" +
        "<BODY>\n" +
            "\n<DIV CLASS='tweet'>\n" +
            "<H1>" + tweet.userName + "</H1>" +
            "<P>" + tweet.message + "</P>" +
            "<time>" + tweet.date + "</time>" +
            "\n</DIV>\n" +
        "\n</BODY></HTML>");
}


// LOL Web scale
var contents = fs.readFileSync('sample-tweets.txt', {'encoding': 'UTF-8'});

var tweet = readTweet(contents);

writeTweet(tweet);
