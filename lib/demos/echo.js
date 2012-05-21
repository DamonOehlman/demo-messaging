var WebSocketServer = require('ws').Server;
    
exports.run = function(opts) {
    // create the demo server
    var wss = new WebSocketServer(opts);

    wss.on('connection', function(ws) {
        ws.on('message', function(message) {
            ws.send(message);
        });
    });
    
    return wss;
};