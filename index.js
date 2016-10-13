/*************************************************
 *
 * PevanBot
 * Evan Carman
 * 2016
 *
 **************************************************/
var pjson = require('./package.json');
var tmi = require('tmi.js');
// make your own oauth.js file to contain the password and bot name
// make sure github does not see that file, to keep it hidden
var oauth = require('./oauth.js');
var twitchApi = require("node-twitchtv");
var puns = [];
// timer delays in minutes
var bttvDelay = 30;
var followDelay = 20;

// reads list of puns from the text file on starting the bot
// stores them in an array to easily access later
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('puns.txt')
});
lineReader.on('line', function (line) {
  puns.push(line);
});


var options = {
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

var tmiClient = tmi.client(options);

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
    if (message == "!bot") {
        tmiClient.say(channel, "Currently running PevanBot v" + pjson.version);
    }

    /* !commands
     * returns link to list of commands
     */
    if (message == "!commands") {
        tmiClient.say(channel, "Beep Boop MrDestructoid " + user.username + " a list of commands can be found here: https://goo.gl/0C9zxp");
    }

    /* !dev
    * provides a link to the trello board for this project
    */
    if (message == "!dev") {
        tmiClient.say(channel, "Progress on the development of PevanBot can be found here: https://trello.com/b/aae08Hkc");
    }

    /* !awesome
     * says the user who called the command is awesome
     */
    if (message == "!awesome") {
        tmiClient.say(channel, user.username + " is awesome! CoolCat");
    }

    /* !crash
     * warns the streamer that there is a black screen or something is wrong
     */
    if (message == "!crash") {
        tmiClient.say(channel, "cmonBruh Something seems to be wrong with the stream " + channel.substr(1) );
    }

    /* !pun
     * random pun is picked from a list
     */
    if (message == "!pun") {
      // generate randome index to pick from pun array
        var r = Math.floor(Math.random() * puns.length);
        tmiClient.say(channel, puns[r] + " Jebaited" );
    }

    //TODO
    /* !uptime
     * returns the total time the channel has been live
     */
    if (message == "!uptime") {

        var chan = channel.substr(1);

        // ?? derp

        tmiClient.say(channel, chan + " has been live for ##");
    }

    //TODO !game
    if (message == "!game") {
// var apiClient = twitchApi({client_id: oauth.username, password: oauth.password });
//
//       console.log(apiClient);
//
//         apiClient.stream({
//             channel: channel.substr(1)
//         }, function(err, response) {
//             console.log(channel.info); // channel info/description
//         });
        tmiClient.say(channel, "WIP SeemsGood");
    }

    /******************************************
     *  channel specific commands
     ******************************************/
    // if (channel == "#pevan95") {
        /* !specs
         * returns link to my build on pcpartpicker
         */
        if (message == "!specs") {
            tmiClient.say(channel, "My build can be found here: http://pcpartpicker.com/list/BbPCQ7");
        }

        /*!pevan
         * shows the correct way to pronounce my name :P
         */
        if (message == "!pevan") {
            tmiClient.say(channel, "not PEEvan PJSalt");
        }
    // }
});

// timer to let people know about BetterTwitchTV
setInterval(
  function () {
    tmiClient.say("#pevan95", "Want to improve your Twitch experience with new features, emotes, and more?  Check out BetterTwitchTV http://nightdev.com/betterttv/")
  },
  // converting minutes to milliseconds
  (bttvDelay * 60000) )

// timer to remind people to follow
  setInterval(
    function () {
      tmiClient.say("#pevan95", "Enjoying this content?  Follow to keep up to date when I'm live Poooound")
    },
    // converting minutes to milliseconds
    (followDelay * 60000) )

/******************************************
 *
 *  host message
 *  TODO currently doesn't respod
 *
 ******************************************/
tmiClient.on("hosted", (channel, user, viewers) => {
    tmiClient.say(channel, "Host hype! Thank you " + user);
});


//TODO on follow display message
// can't use the TMI.js package
