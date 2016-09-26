var request = require('request');
var Promise = require('promise');
var bignumJSON = require('json-bignum');

var Channels = function(urls){
	require('events').EventEmitter.call(this);
	this.urls = urls;
};

require('util').inherits(Channels, require('events').EventEmitter);

var getRequest = function(url){
	return new Promise(function(resolve, reject){
		request(url, function(e, res, body){
			if(e){
				reject(e);
			}else{
				if(res.statusCode == 200) {
					resolve(body);
				} else if (res.status == 500){
					getRequest(url);
				}else {
					var err = new Error('Unexpected status code ' + res.statusCode);
					err.statusCode = res.statusCode;
					reject(err);
				}
			}
		});
	});
};

Channels.prototype.info = function(channel){
	var urls = this.urls;
	return getRequest(urls.channels.info.concat(channel)).then(function(res){
		return bignumJSON.parse(res);
	});
};

module.exports =  Channels;