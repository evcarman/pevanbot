/*************************************************
*
* TwitchBot
* Evan Carman
* 2016
*
**************************************************/
var pjson = require('./package.json');
var tmi = require('tmi.js');
var oauth = require('./oauth.js');
var twitchApi = require("node-twitchtv");

    var options = {
        options: {
            debug: true
        },
        connection: {
            reconnect: true
        },
        identity: {
            // make your own oauth.js file to contain the password and bot name
            // make sure github does not see that file, to keep it hidden
            username: oauth.username,
            password: oauth.password
        },
        channels: ['#pevan95', '#g3btv']

    };

    var client = tmi.client(options);

client.connect();

// regular expression to check for links (thanks Dad)
var regLink = /[A-Za-z0-9]\.[A-Za-z0-9]/;

/******************************************
 *
 *  chat commands
 *
 ******************************************/
client.on("chat", (channel, user, message, self) => {
    // doesn't respond to itself
    if (self) return;

    /*  link filter
     *  checks if message sent contains a link
     *  times out user if they are not a mod
     */
    if (message.match(regLink) && !user.mod) {
        client.timeout(channel, user.username, 10, "posted a link");
        client.say(channel, "KAPOW Stop posting links!");
    }

    /******************************************
     *  generic commands used on any channel
     ******************************************/

     /* !bot
     *  returns version number
     */
     if (message == "!bot") {
       client.say(channel, "Currently running PevanBot v" + pjson.version);
     }

    /* !commands
     * returns link to list of commands
     */
    if (message == "!commands") {
        client.say(channel, "Beep Boop MrDestructoid A list of commands can be found here: https://goo.gl/0C9zxp");
    }

    /* !awesome
     * says the user who called the command is awesome
     */
    if (message == "!awesome") {
        client.say(channel, user.username + " is awesome! CoolCat");
    }

    //TODO
    /* !pun
    * random pun is picked from a list
    */
    if (message == "!pun") {
        client.say(channel, "WIP SeemsGood");
    }

    //TODO
    /* !uptime
     * returns the total time the channel has been live
     */
    if (message == "!uptime") {

        var chan = channel.substr(1);

        // ?? derp

        client.say(channel, chan + " has been live for ##");
    }

    //TODO !game
    if (message == "!game") {
        client.say(channel, "WIP SeemsGood");
    }

    /******************************************
     *  channel specific commands
     ******************************************/
    if (channel == "#pevan95") {
        /* !specs
         * returns link to my build on pcpartpicker
         */
        if (message == "!specs") {
            client.say(channel, "My build can be found here: http://pcpartpicker.com/list/BbPCQ7");
        }

        /*!pevan
         * shows the correct way to pronounce my name :P
         */
        if (message == "!pevan") {
            client.say(channel, "not PEEvan PJSalt");
        }
    }
});

//TODO on connect start timer to push notifications

/******************************************
 *
 *  host message
 *
 ******************************************/
client.on("hosted", (channel, user, viewers) => {
  client.say(channel, "Host hype! Thank you " + user);
});


//TODO on follow display message
// can't use the TMI.js package
