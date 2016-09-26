TwitchTV-API
============

TwitchTV API for NodeJS applications.


## How to use

The following example shows you how to use this library. In this case we are getting the channel info provided by the API.

```js
var TwitchTV = require('twitchtv-api');

var channel = 'arteezy';

TwitchTV.channels.info(channel).done(function(res){
	console.log(res);
}, function (err) {
	if (err.statusCode === 404) {
		console.log('Page not found');
	} else {
		throw err;
	}
});
```

### Channels
============

## `Get Channel's Info`

#### TwitchTV.channels.info(channel).done.(callback, onError)
* `channel` - String, channel's user to get the info.
* `callback` - Function, callback to be executed, return args: `response`.
* `onError` - Function, if there is an error, the onError functions is executed instead of the callback, to returns args: `err`.



### Streams
============

## `Get Stream's Info`

#### TwitchTV.streams.info(channel).done.(callback, onError)
* `channel` - String, channel's user to get the info.
* `callback` - Function, callback to be executed, return args: `response`.
* `onError` - Function, if there is an error, the onError functions is executed instead of the callback, to returns args: `err`.