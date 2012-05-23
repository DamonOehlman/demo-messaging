var fs = require('fs'),
    path = require('path'),
    debug = require('debug')('demo-client'),
    formatter = require('formatter');

function Client(socket, opts) {
    this.demo = null;
    this.socket = socket;
    
    // ensure we have opts
    opts = opts || {};

    // initialise the demo port and url
    this.port = opts.port || 8001;
    this.wsurl = 'ws://localhost:' + this.port;
}

Client.prototype = {
    activate: function(name) {
        var client = this;
        
        // if we have an active demo, then close the server
        if (this.demo) {
            if (this.demo._server) {
                this.demo._server.once('close', function() {
                    debug('demo server closed');
                    client.demo = null;
                    client.activate(name);
                });
            }

            // attempt to close the demo server
            if (typeof this.demo.close == 'function') {
                try {
                    this.demo.close();
                }
                catch (e) {
                    debug('attempt to close failed', e);
                }
            }
            
            return;
        }
        
        // if the name is set, then attempt to update the demo
        if (name) {
            var clientPath = path.resolve(__dirname, 'demos', 'client'),
                clientFile = path.join(clientPath, name + '-client.js'),
                htmlFile = path.join(clientPath, name + '-client.html'),
                demoMod;
                
            // reset the demo member
            this.demo = null;
                
            // include and run the demo
            try {
                demoMod = require('./demos/' + name);

                this.demo = demoMod.run(this);
                debug('activated demo: ' + name);
            }
            catch (demoLoadError) {
                debug('unable to load demo: ' + name, demoLoadError);
            }
            
            // if we have a demo loaded, then read the client file
            if (this.demo) {
                debug('checking for html files: ' + htmlFile);
                fs.readFile(htmlFile, 'utf8', function(err, data) {
                    if (! err) {
                        var content = formatter(data);

                        client.sendMessage('content', content(client));
                    }

                    // attempt to load the client code
                    debug('attempting to load: ' + clientFile);
                    fs.readFile(clientFile, 'utf8', function(err, data) {
                        if (! err) {
                            var code = formatter(data);

                            client.sendMessage('code', code(client));
                        }
                    });
                });
            }
        }
    },
    
    close: function() {
        if (this.demo) {
            if (this.demo._server) {
                this.demo._server.once('close', function() {
                    debug('demo client closed');
                });
            }

            if (typeof this.demo.close == 'function') {
                this.demo.close();
            }
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