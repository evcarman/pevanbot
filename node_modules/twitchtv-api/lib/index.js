'use strict';

var urls = require('./urls');

var Streams = require('./streams');
var Channels = require('./channels');

var TwitchTV = function(){
	require('events').EventEmitter.call(this);

};

require('util').inherits(TwitchTV, require('events').EventEmitter);

TwitchTV.streams = new Streams(urls);

TwitchTV.channels = new Channels(urls);


module.exports = TwitchTV;