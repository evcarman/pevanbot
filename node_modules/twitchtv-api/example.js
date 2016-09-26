var TwitchTV = require('./lib');

var channel = 'd2l_es';

/*
TwitchTV.channels.info(channel).done(function(res){
	console.log(res);
}, function (err) {

	if (err.statusCode === 404) {
		console.log('Page not found');
	} else {
		throw err;
	}
});

*/

TwitchTV.streams.info(channel).done(function(res){
	console.log(res);
}, function (err) {
	if (err.statusCode === 404) {
		console.log('Page not found');
	} else {
		throw err;
	}
});
