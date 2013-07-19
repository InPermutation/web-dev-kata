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

const SECONDS = 1;
const MINUTES = 60*SECONDS;
const HOURS = 60*MINUTES;
const DAYS = 24*HOURS;
const WEEKS = 7*DAYS;
const MONTHS = 30*DAYS;
const YEARS = 365*DAYS;

function formatDate(str_date) {
   var time = new Date(str_date).getTime();
   var now = new Date().getTime();
   var diff = (now - time) / 1000;

   var result;

   if(diff < 1*MINUTES) {
       result = "Less than a minute ago";
   } else if(diff < 1*HOURS) {
       result = "About " + Math.floor(diff / MINUTES) + " minutes ago";
   } else if(diff < 1*DAYS) {
       result = "About " + Math.floor(diff / HOURS) + " hours ago";
   } else if(diff < 1*WEEKS) {
       result = "About " + Math.floor(diff / DAYS) + " days ago";
   } else if(diff < 1*MONTHS) {
       result = "About " + Math.floor(diff / WEEKS) + " weeks ago";
   } else if(diff < 1*YEARS) {
       result = "About " + Math.floor(diff / MONTHS) + " months ago";
   } else {
       result = "More than " + Math.floor(diff / YEARS) + " years ago";
   }

   return "<time datetime='" + str_date + "'>" + result + "</time>\n";
}

function formatTweet(tweet) {
    return "\n<DIV CLASS='tweet'>\n" +
    "<H1>" + linkify(tweet.userName) + "</H1>" +
    "<P>" + linkify(tweet.message) + "</P>" +
    formatDate(tweet.date) +
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
