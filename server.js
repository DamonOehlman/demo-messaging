var config = require('config'),
    WebSocketServer = require('ws').Server,
    Client = require('./lib/client'),
    clients = [],
    wss;
    
    
// create the new socket server
// create the websocket server
wss = new WebSocketServer(config);

wss.on('connection', function(ws) {
    // create a new client 
    var client = clients[clients.length] = new Client(ws);
    
    ws.on('message', function(message) {
        // if the message is a data request, then invoke the request handler
        if (message.slice(-1) === '?') {
            require('./lib/request-handlers/' + message.slice(0, -1)).call(client);
        }
        else if (message.slice(0, 4) === 'use:') {
            client.activate(message.slice(4));
        }
    });

    ws.on('close', function() {
        clients.splice(clients.indexOf(client), 1);
    });
});