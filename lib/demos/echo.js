var debug = require('debug')('echo-demo'),
    WebSocketServer = require('ws').Server;
    
exports.run = function(opts) {
    // create the demo server
    var wss = new WebSocketServer(opts);

    debug('initialized echo server on port 8001');
    wss.on('connection', function(ws) {
        debug('received connection');

        ws.on('message', function(message) {
            ws.send(message);
        });
    });
    
    return wss;
};