var debug = require('debug')('tweets-sse-demo'),
    config = require('config'),
    http = require('http'),
    SSE = require('sse'),
    Twitter = require('ntwitter'),
    util = require('util'),
    reInvalidChars = /[\\\"\x00-\x1f\ud800-\udfff\ufffe\uffff\u2000-\u20ff]/g;
    
exports.run = function(opts) {
    // create the demo server
    var client = new Twitter(config),
        server;
    
    server = http.createServer(function(req, res) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('okay');
    });

    server.listen(opts.port || 8001, '127.0.0.1', function() {
        var sse = new SSE(server);
        debug('attached sse server to http server');
        
        sse.on('connection', function(eventClient) {
            console.log(eventClient);
            
            debug('tracking topic: twitter');
            client.stream('statuses/filter', { track: 'twitter' }, function(stream) {
                stream.on('data', function(data) {
                    var tweet = {
                            user: data.user.screen_name,
                            text:  (data.text || '').replace(reInvalidChars, '')
                        };
                    
                    debug('captured tweet: ' + tweet.user + ': ' + tweet.text);
                    
                    try {
                        eventClient.send(JSON.stringify(tweet));
                    }
                    catch (e) {
                        debug('error sending tweet across the wire');
                    }
                });
                
                eventClient.on('close', function() {
                    stream.destroy();
                });
            });
        });
    });

    return server;
};