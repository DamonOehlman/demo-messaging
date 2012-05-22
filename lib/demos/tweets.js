var debug = require('debug')('tweets-demo'),
    config = require('config'),
    WebSocketServer = require('ws').Server,
    Twitter = require('ntwitter'),
    util = require('util'),
    reInvalidChars = /[\\\"\x00-\x1f\ud800-\udfff\ufffe\uffff\u2000-\u20ff]/g;
    
exports.run = function(opts) {
    // create the demo server
    var client = new Twitter(config),
        wss = new WebSocketServer(opts),
        clients = [];

    wss.on('connection', function(ws) {
        ws.on('message', function(topic) {
            debug('tracking topic: ' + topic);
            client.stream('statuses/filter', { track: topic }, function(stream) {
                stream.on('data', function(data) {
                    var tweet = {
                            avatar: data.user.profile_image_url,
                            user:   data.user.screen_name,
                            text:  (data.text || '').replace(reInvalidChars, '')
                        };
                    
                    // debug('captured tweet: ', data);
                    
                    try {
                        ws.send(JSON.stringify(tweet));
                    }
                    catch (e) {
                        debug('error sending tweet across the wire');
                    }
                });
                
                ws.on('close', function() {
                    stream.destroy();
                });
            });
        });
    });

    return wss;
};