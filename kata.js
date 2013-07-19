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

function linkify(str) {
    return str.replace(/@\w+|#\w+/g, function(m) {
        switch(m[0]) {
            case '@':
                var username = m.substr(1);
                return "<a href='https://twitter.com/" + username + "'>" +
                    m + "</a>";
            case '#':
                var hashtag = m.substr(1);
                return "<a href='https://twitter.com/search/%23" + hashtag + "'>" +
                    m + "</a>";
        }
        return m;
    });
}

function formatTweet(tweet) {
    return "\n<DIV CLASS='tweet'>\n" +
    "<H1>" + linkify(tweet.userName) + "</H1>" +
    "<P>" + linkify(tweet.message) + "</P>" +
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
