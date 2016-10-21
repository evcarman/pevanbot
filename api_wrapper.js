var http = require("http");

function getStream (channel) {
	var url = "http://api.twitch.com/kraken/streams/" + channel;
	/*
	headers: {
		'Client-ID': 'rjtftra8olb8jes1r8vvp05p58wbsku'
	}
	*/

	var request = http.get(url, function (response) {
		// data is streamed in chunks from the server
    		// so we have to handle the "data" event    
    		var buffer = "";

		response.on("data", function (chunk) {
        			buffer += chunk;
    		}); 

   		response.on("end", function (err) {
        			// finished transferring data
        			// dump the raw data
        			console.log(buffer);
        			console.log("\n");
        			return JSON.parse(buffer);
		});
	});
};
