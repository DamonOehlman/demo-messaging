var path = require('path'),
    fs = require('fs'),
    demoPath = path.resolve(__dirname, '../demos'),
    demos;

module.exports = function() {
    var client = this;
    
    if (demos) {
        this.sendMessage('demos', demos);
    }
    else {
        fs.readdir(demoPath, function(err, files) {
            // filter names out
            demos = files
                .filter(function(file) {
                    return path.extname(file) === '.js';
                })
                .map(function(file) {
                    return path.basename(file, '.js');
                });
                
            console.log(demos);
            
            client.sendMessage('demos', demos);
        });
    }
};