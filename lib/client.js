var fs = require('fs'),
    path = require('path'),
    debug = require('debug')('demo-client');

function Client(socket) {
    this.demo = null;
    this.socket = socket;
}

Client.prototype = {
    activate: function(name) {
        var client = this;
        
        // if we have an active demo, then close the server
        if (this.demo && this.demo._server) {
            this.demo._server.once('close', function() {
                debug('demo server closed');
                client.demo = null;
                client.activate(name);
            });

            this.demo.close();
            return;
        }
        
        // if the name is set, then attempt to update the demo
        if (name) {
            var clientFile = path.resolve(__dirname, 'demos', 'client', name + '-client.js'),
                demoMod = require('./demos/' + name);
                
            this.demo = demoMod.run({ port: 8001 });
            debug('activated demo: ' + name);

            // attempt to load the client code
            debug('attempting to load: ' + clientFile);
            fs.readFile(clientFile, 'utf8', function(err, data) {
                if (! err) {
                    client.sendMessage('code', data);
                }
            });
        }
    },
    
    send: function(data) {
        if (typeof data == 'string' || data instanceof String) {
            this.socket.send(data);
        }
        else {
            this.socket.send(JSON.stringify(data));
        }
    },
    
    sendMessage: function(message) {
        debug('sending message: ' + message);
        
        this.send({
            msg: message,
            args: Array.prototype.slice.call(arguments, 1)
        });
    }
};

module.exports = Client;