var fs = require('fs'),
    server = require('https').createServer({
        key: fs.readFileSync(__dirname + '/assets/privkey.pem'),
        cert: fs.readFileSync(__dirname + '/assets/fullchain.pem')
    });
    
module.exports = server;