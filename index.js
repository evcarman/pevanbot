/*************************************************
 *
 * PevanBot
 * Evan Carman
 * 2016
 *
 **************************************************/

// personal packages/files
var pjson = require('./package.json');


// external packages
var request = require('request');
var twitchApi = require("node-twitchtv");
var tmi = require('tmi.js');
var moment = require ('moment');

// make your own oauth.js file to contain the password and bot name
// make sure github does not see that file, to keep it hidden
var oauth = require('./oauth.js');

// empty array to fill with puns
var puns = [];
// timer delays in minutes
var bttvDelay = 45;
var followDelay = 30;

// reads list of puns from the text file on starting the bot
// stores them in an array to easily access later
var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('puns.txt')
});
lineReader.on('line', function(line) {
    puns.push(line);
});


var kraken = request.defaults({
    baseUrl: 'https://api.twitch.tv/kraken/',
    headers: {
        'Accept': 'application/vnd.twitchtv.v3+json',
        'Client-ID': 'rjtftra8olb8jes1r8vvp05p58wbsku'
    },
    json: true
})

var tmiOptions = {
    options: {
        debug: true
    },
    connection: {
        reconnect: true
    },
    identity: {
        username: oauth.username,
        password: oauth.token
    },
    channels: ['#pevan95', '#g3btv']

};

var tmiClient = tmi.client(tmiOptions);

tmiClient.connect();

// regular expression to check for links (thanks Dad)
var regLink = /[A-Za-z0-9]\.[A-Za-z0-9]/;

/******************************************
 *
 *  chat commands
 *
 ******************************************/
tmiClient.on("chat", (channel, user, message, self) => {
    // doesn't respond to itself
    if (self) return;

    // sets up variables to use in all commands
    var chan = channel.slice(1);
    var params = message.split(' ');
    var command = params.shift().toLowerCase();

    /*  link filter
     *  checks if message sent contains a link
     *  times out user if they are not a mod
     */
    if (channel == "#pevan95" && message.match(regLink) && !user.mod) {
        tmiClient.timeout(channel, user.username, 10, "posted a link");
        tmiClient.say(channel, "KAPOW Stop posting links!");
    }

    /******************************************
     *  generic commands used on any channel
     ******************************************/

    /* !bot
     *  returns version number
     */
    if (command === "!bot") {
        tmiClient.say(channel, "Currently running PevanBot v" + pjson.version);
    }

    /* !commands
     * returns link to list of commands
     */
    if (command === "!commands") {
        tmiClient.say(channel, "Beep Boop MrDestructoid " + user.username + " -> a list of commands can be found here: https://goo.gl/0C9zxp");
    }

    /* !dev
     * provides a link to the trello board for this project
     */
    if (command === "!dev") {
        tmiClient.say(channel, "Progress on the development of PevanBot can be found here: https://trello.com/b/aae08Hkc");
    }

    /* !discord
     * provides a link to the G3btv discord
     */
    if (command === "!discord") {
        tmiClient.say(channel, "Come join the community on discord: https://discord.gg/epKsExj")
    }

    /* !awesome
     * says the user who called the command is awesome
     */
    if (command === "!awesome") {
        tmiClient.say(channel, user.username + " is awesome! CoolCat");
    }

    /* !crash
     * warns the streamer that there is a black screen or something is wrong
     */
    if (command === "!crash") {
        tmiClient.say(channel, "cmonBruh Something seems to be wrong with the stream " + channel.substr(1));
    }

    /* !pun
     * random pun is picked from a list
     */
    if (command === "!pun") {
        // generate randome index to pick from pun array
        var r = Math.floor(Math.random() * puns.length);
        tmiClient.say(channel, puns[r] + " Jebaited");
    }

    //TODO
    /* !uptime
     * returns the total time the channel has been live
     */
    if (command === "!uptime") {
        kraken({
            url: 'streams/' + chan
        }, (err, res, body) => {
            // handles error from http request
            if (err || res.statusCode !== 200) {
                console.log('Error: ' + err.message);
                return tmiClient.say(channel, "Something went wrong panicBasket");
            }

            if (!body.stream) {
                return tmiClient.say(channel, "This channel is not currently live");
            } else {
                var created = moment(body.stream.created_at);
                var now = moment()
                var uptime = now.subtract(created);

                console.log('from JSON: ' + body.stream.created_at);
                console.log('created moment: ' + created);
                console.log('now: ' + now);
                console.log('uptime: ' + uptime)
                console.log('formated: ' + uptime.days() + ' ' + uptime.hours() + ' ' + uptime.minutes() );

                //return tmiClient.say(channel, chan + " has been live for " + uptime.hours() + ' hours and ' + uptime.minutes() + ' minutes');
            }
        });
    }

    /* !game
     * uses twitch kraken api to get the game object from the curret stream
     */
    if (command === "!game") {

        kraken({
            url: 'streams/' + chan
        }, (err, res, body) => {
            // handles error from http request
            if (err || res.statusCode !== 200) {
                console.log('Error: ' + err.message);
                return tmiClient.say(channel, "Something went wrong panicBasket");
            }

            if (!body.stream) {
                return tmiClient.say(channel, "This channel is not currently live");
            } else {
                return tmiClient.say(channel, "The current game is " + body.stream.game);
            }
        });
    }

    /******************************************
     *  channel specific commands
     ******************************************/
    // if (channel == "#pevan95") {
    /* !specs
     * returns link to my build on pcpartpicker
     */
    if (command === "!specs") {
        tmiClient.say(channel, "My build can be found here: http://pcpartpicker.com/list/BbPCQ7");
    }

    /*!pevan
     * shows the correct way to pronounce my name :P
     */
    if (command === "!pevan") {
        tmiClient.say(channel, "not PEEvan PJSalt");
    }
    // }
});

// timer to let people know about BetterTwitchTV
setInterval(
    function() {
        tmiClient.say("#pevan95", "Want to improve your Twitch experience with new features, emotes, and more?  Check out BetterTwitchTV http://nightdev.com/betterttv/")
    },
    // converting minutes to milliseconds
    (bttvDelay * 60000))

// timer to remind people to follow
setInterval(
    function() {
        tmiClient.say("#pevan95", "Enjoying this content?  Follow to keep up to date when I'm live Poooound")
    },
    // converting minutes to milliseconds
    (followDelay * 60000))

/******************************************
 *
 *  host message
 *  TODO currently doesn't work
 *
 ******************************************/
tmiClient.on("hosted", (channel, user, viewers) => {
    tmiClient.say(channel, "Host hype! Thank you " + user);
});


//TODO on follow display message
// can't use the TMI.js package
