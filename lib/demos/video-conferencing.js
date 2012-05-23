var debug = require('debug')('videoconf-demo'),
    config = require('config'),
    WebSocketServer = require('ws').Server;
        
exports.run = function(opts) {
    // create the demo server
    var wss = new WebSocketServer(opts),
        clients = [];

    wss.on('connection', function(ws) {
        ws.on('message', function(topic) {
            
        });
    });

    return wss;
};