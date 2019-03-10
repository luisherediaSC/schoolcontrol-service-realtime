var emmiter = require(__dirname + '/../Emitter'),
    Identity = require(__dirname + '/../models/identities'),
    logger = require(__dirname + '/../Logger'),
    thinky = require(__dirname + '/../util/thinky.js'),
    Errors = thinky.Errors,
    r = thinky.r,
    api = {
        
        setup: function() {
            
            emmiter.on('socketio disconnect', api.onDisconnect);
            
        },
        
        onDisconnect: function(idSocket) {
            
            Identity.filter(function(record) {
                
                return record('idSocket').match(idSocket);
                
            }).update({
                online: false,
                idSocket: null
            }).run();
            
        }
        
    };

module.exports = api;
