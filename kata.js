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

function pluralize(number, label) {
    if(number == 1) { return "one " + label; }
    return number + " " + label + "s";
}

function formatDate(str_date) {
   var time = new Date(str_date).getTime();
   var now = new Date().getTime();
   var diff = (now - time) / 1000;

   var result;

   if(diff < 1*MINUTES) {
       result = "Less than a minute ago";
   } else if(diff < 1*HOURS) {
       result = "About " + pluralize(Math.floor(diff / MINUTES), "minute") + " ago";
   } else if(diff < 1*DAYS) {
       result = "About " + pluralize(Math.floor(diff / HOURS), "hour") + " ago";
   } else if(diff < 1*WEEKS) {
       result = "About " + pluralize(Math.floor(diff / DAYS), "day") + " ago";
   } else if(diff < 1*MONTHS) {
       result = "About " + pluralize(Math.floor(diff / WEEKS), "week") + " ago";
   } else if(diff < 1*YEARS) {
       result = "About " + pluralize(Math.floor(diff / MONTHS), "month") + " ago";
   } else {
       result = "More than " + pluralize(Math.floor(diff / YEARS), "year") + " ago";
   }

   return "<time datetime='" + str_date + "'>" + result + "</time>\n";
}

function formatTweet(tweet) {
    return "\n<DIV CLASS='tweet'>\n" +
    "<H1><A HREF='/" + tweet.userName + "'>" + tweet.userName + "</A></H1>" +
    "<P>" + linkify(tweet.message) + "</P>" +
    formatDate(tweet.date) +
    "\n</DIV>\n";
}

function writeTweets(tweets, fileName, title) {
    console.log(fileName);
    // LOL Web scale
    fs.writeFileSync(fileName || '_site/index.html',
        "<!DOCTYPE html>\n" +
        "<HTML>\n" +
        "<HEAD>\n" +
            "<TITLE>" + (title || "${Microblog} for dummies") + "</TITLE>\n" +
            "<link rel='stylesheet' type='text/css' href='/theme.css' />\n" +
        "</HEAD>" +
        "<BODY>\n" +
        tweets.map(formatTweet).join('') +
        "\n</BODY></HTML>");
}

function writeUserPage(userName, userTweets) {
    if(userTweets.length > 0 && userName) {
        try{
            fs.mkdirSync("_site/" + userName);
        } catch(E) { }
        writeTweets(userTweets, "_site/" + userName + "/index.html", userName + "'s Page");
    }
}
function writeUserPages(tweets) {
    tweets.sort(function(A, B) {
        if(A.userName == B.userName) return 0;
        if(A.userName > B.userName) return 1;
        return -1;
    });
    var userName;
    var userTweets = [];
    for(var i = 0; i < tweets.length; i++) {
        var tweet = tweets[i];
        if (tweet.userName != userName) {
            writeUserPage(userName, userTweets);
            userName = tweet.userName;
            userTweets = [];
        }
        userTweets.push(tweet);
    }
    writeUserPage(userName, userTweets);
}

// LOL Web scale
var contents = fs.readFileSync('sample-tweets.txt', {'encoding': 'UTF-8'});

var tweets = readTweets(contents);

writeTweets(tweets);
writeUserPages(tweets);
