var config = require('config'),
    express = require('express'),
    WebSocketServer = require('ws').Server,
    Client = require('./lib/client'),
    app = express.createServer(),
    clients = [],
    wss,
    nextPort = 8001;
    
// create the new socket server
// create the websocket server
wss = new WebSocketServer(config);

wss.on('connection', function(ws) {
    // create a new client 
    var client = clients[clients.length] = new Client(ws, {
        port: nextPort++
    });
    
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
        // close the client
        client.close();
        
        clients.splice(clients.indexOf(client), 1);
    });
});

app.use(express.static(__dirname));
app.listen(config.webport);